interface BadgeProps {
  label: string;
  color?: "primary" | "secondary" | "accent" | "blue" | "purple" | "gray";
  size?: "sm" | "md" | "lg";
  className?: string;
}

export default function Badge({
  label,
  color = "primary",
  size = "md",
  className = "",
}: BadgeProps) {
  const colorClasses = {
    primary:
      "bg-gradient-to-b from-game-primary to-[#388E3C] text-white border-[#2E7D32]",
    secondary:
      "bg-gradient-to-b from-game-secondary to-[#FFA000] text-white border-[#FF8F00]",
    accent:
      "bg-gradient-to-b from-game-accent to-[#D32F2F] text-white border-[#B71C1C]",
    blue: "bg-gradient-to-b from-game-blue to-[#1976D2] text-white border-[#0D47A1]",
    purple:
      "bg-gradient-to-b from-game-purple to-[#5E35B1] text-white border-[#4527A0]",
    gray: "bg-gradient-to-b from-gray-400 to-gray-500 text-white border-gray-600",
  };

  const sizeClasses = {
    sm: "text-xs py-0.5 px-2 border-b-[1px]",
    md: "text-xs py-1 px-2.5 border-b-[2px]",
    lg: "text-sm py-1.5 px-3 border-b-[2px]",
  };

  return (
    <span
      className={`game-badge ${colorClasses[color]} ${sizeClasses[size]} ${className}`}
    >
      {label}
    </span>
  );
}
