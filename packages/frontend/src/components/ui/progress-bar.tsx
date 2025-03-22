interface ProgressBarProps {
  value: number;
  max: number;
  label?: string;
  showValue?: boolean;
  color?: "primary" | "secondary" | "blue" | "purple" | "accent";
  className?: string;
}

export default function ProgressBar({
  value,
  max,
  label,
  showValue = true,
  color = "primary",
  className = "",
}: ProgressBarProps) {
  const percentage = Math.min(100, Math.max(0, (value / max) * 100));

  const colorClasses = {
    primary: "bg-gradient-to-r from-[#4CAF50] to-[#8BC34A]",
    secondary: "bg-gradient-to-r from-[#FFC107] to-[#FFEB3B]",
    blue: "bg-gradient-to-r from-[#2196F3] to-[#03A9F4]",
    purple: "bg-gradient-to-r from-[#673AB7] to-[#9C27B0]",
    accent: "bg-gradient-to-r from-[#F44336] to-[#FF5722]",
  };

  return (
    <div className={`space-y-1 ${className}`}>
      {label && (
        <div className="flex justify-between text-sm">
          <span className="text-foreground font-medium">{label}</span>
          {showValue && (
            <span className="text-muted-foreground">
              {value}/{max}
            </span>
          )}
        </div>
      )}

      <div className="game-progress-bar">
        <div
          className={`game-progress-fill ${colorClasses[color]}`}
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );
}
