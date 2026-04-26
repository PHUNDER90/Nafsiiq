import { Skeleton } from "@/components/ui/skeleton";

export default function PsychologistLoading() {
  return (
    <div className="space-y-6 p-6 md:p-8">
      <Skeleton className="h-8 w-48 rounded-xl" />
      {[1, 2, 3, 4].map((i) => (
        <Skeleton key={i} className="h-24 w-full rounded-2xl" />
      ))}
    </div>
  );
}
