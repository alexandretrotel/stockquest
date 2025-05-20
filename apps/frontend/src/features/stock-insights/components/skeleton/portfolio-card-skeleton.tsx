import { Skeleton } from "@/components/ui/skeleton";

export default function PortfolioCardSkeleton() {
  return (
    <div className="game-card flex flex-col justify-between gap-4 p-4">
      <div className="flex flex-col gap-4">
        <div className="flex flex-col gap-2">
          <div className="flex items-center justify-between gap-2">
            <Skeleton className="h-5 w-1/2" />
            <Skeleton className="h-5 w-12 rounded-full" />
          </div>

          <Skeleton className="h-4 w-32" />
        </div>

        <div className="flex flex-col gap-2">
          <Skeleton className="h-4 w-full rounded-sm" />
          <Skeleton className="h-4 w-5/6 rounded-sm" />
          <Skeleton className="h-4 w-4/6 rounded-sm" />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4 pt-2">
        <Skeleton className="h-9 w-full rounded-md" />
        <Skeleton className="h-9 w-full rounded-md" />
      </div>
    </div>
  );
}
