import { FEATURES } from "@/data/stockquest-ai";

export default function Features() {
  return (
    <div className="game-card flex flex-col gap-4 p-4">
      <h1 className="text-2xl font-bold">Features</h1>

      <div className="flex flex-col gap-4">
        {FEATURES.map((feature, index) => (
          <div key={index} className="flex flex-col gap-1">
            <div className="flex items-center gap-2">
              <feature.icon className="text-game-primary" size={20} />
              <h2 className="font-semibold">{feature.title}</h2>
            </div>

            <p className="text-muted-foreground text-sm">
              {feature.description}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
