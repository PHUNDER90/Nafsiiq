import { Skeleton } from "@/components/ui/skeleton";

export default function AdminLoading() {
  return (
    <div className="space-y-8 p-6 md:p-8">
      <Skeleton className="h-8 w-40 rounded-xl" />

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {[1, 2].map((i) => (
          <Skeleton key={i} className="h-28 w-full rounded-2xl" />
        ))}
      </div>

      {/* Chart placeholder */}
      <Skeleton className="h-72 w-full rounded-2xl" />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {[1, 2].map((col) => (
          <div key={col} className="space-y-3">
            <Skeleton className="h-6 w-36 rounded-lg" />
            {[1, 2, 3, 4, 5].map((row) => (
              <Skeleton key={row} className="h-14 w-full rounded-xl" />
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}
