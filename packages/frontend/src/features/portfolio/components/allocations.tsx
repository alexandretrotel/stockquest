type Allocation = {
  symbol: string;
  weight: number;
};

interface AllocationsProps {
  allocations: Allocation[];
}

export default function AllocationsSection({ allocations }: AllocationsProps) {
  return (
    <div className="flex flex-col gap-2">
      <p className="font-semibold">
        {allocations.length} asset{allocations.length > 1 && "s"}
      </p>
      <div className="flex h-4 overflow-hidden rounded-full">
        {allocations.map((item, index) => (
          <div
            key={index}
            className="h-full"
            style={{
              width: `${item.weight * 100}%`,
              backgroundColor: [
                "#4CAF50",
                "#2196F3",
                "#FFC107",
                "#9C27B0",
                "#F44336",
                "#3F51B5",
                "#009688",
              ][index % 7],
            }}
            title={`${item.symbol}: ${item.weight * 100}%`}
          />
        ))}
      </div>

      <div className="flex flex-wrap gap-x-3 gap-y-1 text-xs">
        {allocations.slice(0, 5).map((item, index) => (
          <div key={index} className="flex items-center gap-1">
            <div
              className="h-2 w-2 rounded-full"
              style={{
                backgroundColor: [
                  "#4CAF50",
                  "#2196F3",
                  "#FFC107",
                  "#9C27B0",
                  "#F44336",
                  "#3F51B5",
                  "#009688",
                ][index % 7],
              }}
            />
            <span className="text-foreground">
              {item.symbol} {(item.weight * 100).toFixed(0)}%
            </span>

            {index === 4 && allocations.length > 5 && (
              <span className="text-muted-foreground">
                +{allocations.length - 5} more
              </span>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
