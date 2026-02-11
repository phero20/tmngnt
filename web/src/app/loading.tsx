import { Skeleton } from '@/components/ui/skeleton';

export default function Loading() {
  return (
    <div className="flex flex-col space-y-3 min-h-screen bg-background p-8">
      <div className="flex justify-between items-center mb-12">
        <Skeleton className="h-8 w-[150px] bg-muted" />
        <Skeleton className="h-10 w-[100px] bg-muted" />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {[1, 2, 3].map((i) => (
          <div key={i} className="flex flex-col space-y-3">
            <Skeleton className="h-[250px] w-full rounded-none bg-muted" />
            <div className="space-y-2">
              <Skeleton className="h-4 w-[250px] bg-muted" />
              <Skeleton className="h-4 w-[200px] bg-muted/60" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
