import { Skeleton } from "@/components/ui/skeleton";

export function StockCardSkeleton() {
  return (
    <div className="game-card group flex h-full flex-col justify-between overflow-hidden">
      <div className="p-4 pb-2">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-4">
            <div className="space-y-2">
              <Skeleton className="mb-2 h-5 w-32" />
              <Skeleton className="h-3 w-20" />
            </div>
          </div>

          <div className="space-y-2 text-right">
            <Skeleton className="mb-2 h-5 w-16" />
            <Skeleton className="h-3 w-20" />
          </div>
        </div>
      </div>

      <div className="flex flex-col gap-2 p-4 pt-0">
        <Skeleton className="h-4 w-36" />
        <Skeleton className="game-button h-10 w-full" />
      </div>
    </div>
  );
}
