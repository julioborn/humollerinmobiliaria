import { HeaderSkeleton, CardGridSkeleton, PanelSkeleton } from "@/components/page-skeleton";
import { Skeleton } from "@/components/ui/skeleton";

export default function Loading() {
  return (
    <div className="flex flex-col gap-6">
      <HeaderSkeleton />
      <CardGridSkeleton count={4} />
      <div className="flex gap-3">
        <Skeleton className="h-10 w-36" />
        <Skeleton className="h-10 w-36" />
        <Skeleton className="h-10 w-36" />
      </div>
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-5">
        <div className="lg:col-span-3">
          <PanelSkeleton rows={5} />
        </div>
        <div className="flex flex-col gap-4 lg:col-span-2">
          <PanelSkeleton rows={2} />
          <PanelSkeleton rows={2} />
        </div>
      </div>
    </div>
  );
}
