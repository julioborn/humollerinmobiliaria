import { HeaderSkeleton, TableSkeleton } from "@/components/page-skeleton";

export default function Loading() {
  return (
    <div className="flex flex-col gap-6">
      <HeaderSkeleton />
      <TableSkeleton cols={5} />
    </div>
  );
}
