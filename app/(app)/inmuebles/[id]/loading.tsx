import { HeaderSkeleton, FormSkeleton, CardGridSkeleton } from "@/components/page-skeleton";

export default function Loading() {
  return (
    <div className="flex flex-col gap-6">
      <HeaderSkeleton />
      <FormSkeleton fields={3} />
      <CardGridSkeleton count={4} />
    </div>
  );
}
