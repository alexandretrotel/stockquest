export const DEV = process.env.NODE_ENV === "development";

export const XP_ANIMATION_DURATION = 4000;

export const CONFETTI_ANIMATION_DURATION = 3000;
export const CONFETTI_NUMBER = 40;

export const BACKTEST_ANIMATION_DURATION = 500;

export const PORTFOLIO_STARTING_VALUE = 10000;

export const BASE_URL = DEV
  ? "http://localhost:3000"
  : "https://www.stockq.app";

export const MINIMUM_USERNAME_LENGTH = 5;
export const MAXIMUM_USERNAME_LENGTH = 30;

export const MINIMUM_PASSWORD_LENGTH = 8;
export const MAXIMUM_PASSWORD_LENGTH = 128;

export const IS_BETA = true;

export const BACKTEST_DIALOG_ANIMATION_FREQUENCY = 50;

export const BACKTEST_YEARS = 10;

export const DEFAULT_AUTH_REDIRECT_PAGE = "/auth/signup";

export const DEFAULT_RESEND_EMAIL = "hi@stockq.app";

export const MOST_PROFITABLE_PORTFOLIOS_NUMBER = 5;

export const PASSKEY_ENABLED = false;
