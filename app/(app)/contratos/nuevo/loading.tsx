import { HeaderSkeleton, FormSkeleton } from "@/components/page-skeleton";

export default function Loading() {
  return (
    <div className="flex flex-col gap-6">
      <HeaderSkeleton />
      <FormSkeleton />
    </div>
  );
}
