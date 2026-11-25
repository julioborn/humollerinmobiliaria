import { HeaderSkeleton, TableSkeleton } from "@/components/page-skeleton";
import { Skeleton } from "@/components/ui/skeleton";

export default function Loading() {
  return (
    <div className="flex flex-col gap-6">
      <HeaderSkeleton />
      <Skeleton className="h-20 w-full" />
      <TableSkeleton cols={6} />
    </div>
  );
}
