from functools import wraps
from os import getenv
from flask import Flask, Response, make_response, request, jsonify
from flask_cors import CORS
from typing import Callable, Dict, Any, List, Optional, TypedDict
from dotenv import load_dotenv
import numpy as np
from scipy.optimize import minimize


# Type Definitions
class quotes(TypedDict):
    adjclose: Optional[float]
    date: str
    high: Optional[float]
    low: Optional[float]
    open: Optional[float]
    close: Optional[float]
    volume: Optional[int]


class Quote(TypedDict):
    symbol: str
    quotes: List[quotes]


# Utility Functions
def extract_prices(
    stock_data: List[quotes], dates: List[str]
) -> np.ndarray[Any, np.dtype[np.float64]]:
    """Extract prices for the given dates from stock data."""
    price_dict = {
        entry["date"]: (entry.get("adjclose") or entry.get("close"))
        for entry in stock_data
    }
    return np.array([price_dict[date] for date in dates])


def calculate_returns(
    prices: np.ndarray[Any, np.dtype[np.float64]],
) -> np.ndarray[Any, np.dtype[np.float64]]:
    """Calculate returns from price data."""
    return prices[1:] / prices[:-1] - 1


def negative_sharpe_ratio(
    weights: np.ndarray[Any, np.dtype[np.float64]],
    exp_returns: np.ndarray[Any, np.dtype[np.float64]],
    cov_mat: np.ndarray[Any, np.dtype[np.float64]],
    rf_rate: float,
) -> float:
    """Calculate the negative Sharpe ratio for optimization."""
    portfolio_return = np.dot(weights, exp_returns)
    portfolio_variance = np.dot(weights.T, np.dot(cov_mat, weights))
    if portfolio_variance <= 0:
        return np.inf
    sharpe_ratio: float = (portfolio_return - rf_rate) / np.sqrt(portfolio_variance)
    return -sharpe_ratio


def calculate_max_drawdown(values: np.ndarray[Any, np.dtype[np.float64]]) -> float:
    """Calculate the maximum drawdown from value data."""
    max_values = np.maximum.accumulate(values)
    drawdowns = (max_values - values) / max_values
    return -np.max(drawdowns) if len(drawdowns) > 0 else 0.0


def calculate_sharpe_ratio(
    returns: np.ndarray[Any, np.dtype[np.float64]], rf_rate: float
) -> float:
    """Calculate the Sharpe ratio from returns data."""
    if len(returns) < 2:
        return 0.0
    mean_daily = np.mean(returns)
    std_daily = np.std(returns)
    if std_daily == 0:
        return 0.0
    annualized_mean: float = mean_daily * 252
    annualized_std: float = std_daily * np.sqrt(252)
    return (annualized_mean - rf_rate) / annualized_std


# Authentication Decorator
def require_auth(f: Callable[..., Any]) -> Callable[..., Any]:
    """Decorator to require a valid Bearer token for API endpoints."""

    @wraps(f)
    def decorated(*args: Any, **kwargs: Any) -> Any:
        auth_header = request.headers.get("Authorization")
        if not auth_header:
            app.logger.warning("No authorization token provided")
            return jsonify({"error": "No authorization token provided"}), 401
        try:
            token_type, token = auth_header.split()
            if token_type.lower() != "bearer" or token != VALID_TOKEN:
                app.logger.warning("Invalid or incorrect token")
                return jsonify({"error": "Invalid or incorrect token"}), 401
        except ValueError:
            app.logger.error("Invalid authorization header format")
            return jsonify({"error": "Invalid authorization header format"}), 401
        return f(*args, **kwargs)

    return decorated


# Flask App Initialization
app = Flask(__name__)
CORS(
    app,
    resources={
        r"/*": {
            "origins": ["http://localhost:3000", "https://stockquest.vercel.app", "https://stockq.app"],
            "methods": ["GET", "POST", "OPTIONS"],
            "allow_headers": ["Content-Type", "Authorization"],
            "supports_credentials": True,
        }
    },
)

load_dotenv()
VALID_TOKEN = getenv("STOCKQUEST_API_BEARER_TOKEN")
if not VALID_TOKEN:
    raise ValueError("API_BEARER_TOKEN environment variable not set")


# API Handlers
@app.route("/")
def home_handler() -> str:
    """Return a simple greeting for the root endpoint."""
    app.logger.info("Home route accessed")
    return "Welcome to the StockQuest API!"


@app.route("/optimize-weights", methods=["POST"])
@require_auth
def optimize_weights_handler() -> Response:
    """
    Optimize portfolio weights based on the Sharpe ratio.
    Expects JSON with 'quotes' (list of stock objects with 'symbol' and 'quotes')
    and optional 'risk_free_rate'. Returns optimized weights or an error.
    """
    try:
        data: Dict[str, Any] = request.get_json()
        if not isinstance(data.get("quotes"), list):
            return make_response(
                jsonify({"error": "Invalid or missing 'quotes' data"}), 400
            )
        stocks_data: List[Quote] = data["quotes"]
        risk_free_rate: float = data.get("risk_free_rate", 0.0)

        app.logger.info(
            f"Received request to optimize weights for {len(stocks_data)} stocks"
        )

        # Find common dates with valid prices
        date_sets = [
            {
                entry["date"]
                for entry in stock["quotes"]
                if entry.get("adjclose") is not None or entry.get("close") is not None
            }
            for stock in stocks_data
        ]
        common_dates = sorted(set.intersection(*date_sets))
        if len(common_dates) < 2:
            raise ValueError("Not enough common dates to compute returns")

        app.logger.info(f"Found {len(common_dates)} common dates")

        # Extract prices and calculate returns
        prices_dict = {
            stock["symbol"]: extract_prices(stock["quotes"], common_dates)
            for stock in stocks_data
        }
        returns_dict = {
            symbol: calculate_returns(prices) for symbol, prices in prices_dict.items()
        }

        stocks = [stock["symbol"] for stock in stocks_data]
        returns_array = np.array([returns_dict[stock] for stock in stocks]).T
        expected_returns = np.mean(returns_array, axis=0)
        cov_matrix = np.cov(returns_array, rowvar=False)

        # Optimize weights
        number_of_stocks = len(stocks)
        initial_weights = np.ones(number_of_stocks) / number_of_stocks
        bounds = [(0, 1) for _ in range(number_of_stocks)]
        constraints = [{"type": "eq", "fun": lambda weights: np.sum(weights) - 1}]

        result = minimize(
            negative_sharpe_ratio,
            initial_weights,
            args=(expected_returns, cov_matrix, risk_free_rate),
            method="SLSQP",
            bounds=bounds,
            constraints=constraints,
        )

        if result.success:
            optimal_weights = result.x  # Convert to percentages
            weights_dict = dict(zip(stocks, optimal_weights))
            app.logger.info("Optimization successful")
            return make_response(jsonify(weights_dict), 200)
        else:
            app.logger.error(f"Optimization failed: {result.message}")
            return make_response(
                jsonify({"error": f"Optimization failed: {result.message}"}), 500
            )

    except Exception as e:
        app.logger.error(f"Error in optimize_weights_handler: {e}", exc_info=True)
        return make_response(jsonify({"error": str(e)}), 500)


@app.route("/simulate-portfolio", methods=["POST"])
@require_auth
def simulate_portfolio_handler() -> Response:
    """
    Get performance of a portfolio against a benchmark.
    Expects JSON with 'quotes' (list of stock objects), 'weights' (dict), 'benchmark' (list of quotes),
    and optional 'risk_free_rate'. Returns performance results or an error.
    """
    try:
        data: Dict[str, Any] = request.get_json()
        app.logger.info(f"Received data: {data}")
        if (
            not isinstance(data.get("quotes"), list)
            or not isinstance(data.get("weights"), dict)
            or not isinstance(data.get("benchmark"), list)
        ):
            return make_response(
                jsonify({"error": "Invalid or missing input data"}), 400
            )
        stocks_data: List[Quote] = data["quotes"]
        weights: Dict[str, float] = data["weights"]
        benchmark_data: List[quotes] = data["benchmark"]
        risk_free_rate: float = data.get("risk_free_rate", 0.0)

        # Find common dates
        date_sets = [
            {
                entry["date"]
                for entry in stock["quotes"]
                if entry.get("adjclose") is not None or entry.get("close") is not None
            }
            for stock in stocks_data
        ]
        benchmark_dates = {
            entry["date"]
            for entry in benchmark_data
            if entry.get("adjclose") is not None or entry.get("close") is not None
        }
        date_sets.append(benchmark_dates)
        common_dates = sorted(set.intersection(*date_sets))
        if len(common_dates) < 2:
            print(common_dates)
            raise ValueError("Not enough common dates to compute returns")

        # Extract prices and calculate returns
        prices_dict = {
            stock["symbol"]: extract_prices(stock["quotes"], common_dates)
            for stock in stocks_data
        }
        benchmark_prices = extract_prices(benchmark_data, common_dates)
        returns_dict = {
            symbol: calculate_returns(prices) for symbol, prices in prices_dict.items()
        }
        benchmark_returns = calculate_returns(benchmark_prices)

        # Transform weights from percentages to fractions
        weights = {symbol: weight for symbol, weight in weights.items()}
        app.logger.info(f"Portfolio weights: {weights}")

        # Validate weights
        symbols = [stock["symbol"] for stock in stocks_data]
        if set(weights.keys()) != set(symbols):
            raise ValueError("Weights do not match the provided stocks")
        if not np.isclose(sum(weights.values()), 1.0):
            raise ValueError("Weights must sum to 1")

        # Calculate portfolio returns
        returns_matrix = np.array([returns_dict[symbol] for symbol in symbols]).T
        weights_vector = np.array([weights[symbol] for symbol in symbols])
        portfolio_returns = np.dot(returns_matrix, weights_vector)

        # Calculate portfolio and benchmark values
        portfolio_values = np.cumprod(1 + portfolio_returns)
        benchmark_values = np.cumprod(1 + benchmark_returns)
        portfolio_values = np.insert(portfolio_values, 0, 1.0)
        benchmark_values = np.insert(benchmark_values, 0, 1.0)

        # Performance metrics
        portfolio_total_return = portfolio_values[-1] - 1
        benchmark_total_return = benchmark_values[-1] - 1
        portfolio_max_drawdown = calculate_max_drawdown(portfolio_values)
        benchmark_max_drawdown = calculate_max_drawdown(benchmark_values)
        portfolio_sharpe = calculate_sharpe_ratio(portfolio_returns, risk_free_rate)
        benchmark_sharpe = calculate_sharpe_ratio(benchmark_returns, risk_free_rate)
        returns_difference = portfolio_returns - benchmark_returns
        beats_benchmark = portfolio_total_return > benchmark_total_return

        # Construct response
        portfolio = {
            "sharpeRatio": float(portfolio_sharpe),
            "totalReturn": float(portfolio_total_return), # total return (in fraction)
            "maxDrawdown": float(portfolio_max_drawdown), # max drawdown (in fraction)
            "values": [
                {"date": common_dates[i], "value": float(portfolio_values[i])}
                for i in range(len(common_dates))
            ],
            "returns": [
                {"date": common_dates[i + 1], "value": float(portfolio_returns[i])}
                for i in range(len(portfolio_returns))
            ],
        }

        benchmark = {
            "sharpeRatio": float(benchmark_sharpe),
            "totalReturn": float(benchmark_total_return), # total return (in fraction)
            "maxDrawdown": float(benchmark_max_drawdown), # max drawdown (in fraction)
            "values": [
                {"date": common_dates[i], "value": float(benchmark_values[i])}
                for i in range(len(common_dates))
            ],
            "returns": [
                {"date": common_dates[i + 1], "value": float(benchmark_returns[i])}
                for i in range(len(benchmark_returns))
            ],
        }

        returns_difference_array = [
            {"date": common_dates[i + 1], "value": float(returns_difference[i])} # returns difference (in fraction)
            for i in range(len(returns_difference))
        ]

        response = {
            "portfolio": portfolio,
            "benchmark": benchmark,
            "returnsDifference": returns_difference_array,
            "beatsBenchmark": bool(beats_benchmark),
            "startingDate": common_dates[0],
            "endingDate": common_dates[-1],
        }

        return make_response(jsonify(response), 200)

    except Exception as e:
        app.logger.error(f"{e}", exc_info=True)
        return make_response(jsonify({"error": str(e)}), 500)
