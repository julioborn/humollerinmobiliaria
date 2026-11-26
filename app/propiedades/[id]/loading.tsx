import { Skeleton } from "@/components/ui/skeleton";

export default function Loading() {
  return (
    <div className="flex min-h-screen flex-col bg-background">
      <div className="h-16 border-b border-border bg-card" />
      <div className="mx-auto w-full max-w-4xl flex-1 px-4 py-8 sm:px-6">
        <Skeleton className="mb-4 h-4 w-32" />
        <Skeleton className="aspect-[16/9] w-full rounded-md" />
        <div className="mt-6 flex flex-col gap-2">
          <Skeleton className="h-4 w-20" />
          <Skeleton className="h-7 w-72" />
          <Skeleton className="h-4 w-48" />
        </div>
      </div>
    </div>
  );
}
