import { Skeleton } from '@/components/ui/skeleton';

/**
 * Premium Skeleton for Hotel Details
 * Ensures the transition from listings to specific property feels seamless.
 */
export default function HotelDetailsLoading() {
  return (
    <div className="min-h-screen bg-background pb-20">
      {/* Hero Skeleton */}
      <Skeleton className="h-[70vh] w-full bg-muted/40 rounded-none" />

      <div className="max-w-7xl mx-auto px-6 lg:px-12 py-12 grid grid-cols-1 lg:grid-cols-3 gap-12">
        {/* Main Content Skeleton */}
        <div className="lg:col-span-2 space-y-12">
          <div className="space-y-4">
            <Skeleton className="h-10 w-48 bg-muted/40" />
            <Skeleton className="h-4 w-full bg-muted/20" />
            <Skeleton className="h-4 w-full bg-muted/20" />
            <Skeleton className="h-4 w-2/3 bg-muted/20" />
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-8 py-8 border-y border-border/50">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="space-y-2">
                <Skeleton className="h-3 w-12 bg-muted/20" />
                <Skeleton className="h-6 w-20 bg-muted/30" />
              </div>
            ))}
          </div>

          {/* Rooms List Skeleton */}
          <div className="space-y-8">
            <Skeleton className="h-8 w-64 bg-muted/40" />
            {[...Array(2)].map((_, i) => (
              <div
                key={i}
                className="h-64 rounded-2xl border border-border/50 bg-card overflow-hidden flex flex-col md:flex-row"
              >
                <Skeleton className="md:w-[40%] h-full bg-muted/40" />
                <div className="p-8 flex-1 space-y-4">
                  <Skeleton className="h-8 w-3/4 bg-muted/30" />
                  <Skeleton className="h-4 w-full bg-muted/20" />
                  <Skeleton className="h-4 w-1/2 bg-muted/20" />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Sidebar Skeleton */}
        <div className="hidden lg:block space-y-8">
          <div className="sticky top-24 rounded-xl border border-border bg-card p-6 shadow-xl space-y-6">
            <Skeleton className="h-6 w-1/2 mx-auto bg-muted/40" />
            <Skeleton className="h-12 w-full bg-primary/20 rounded-md" />
            <Skeleton className="h-4 w-2/3 mx-auto bg-muted/20" />
          </div>
        </div>
      </div>
    </div>
  );
}
