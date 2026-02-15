import { Skeleton } from '@/components/ui/skeleton';
import { Search } from 'lucide-react';

/**
 * Premium Skeleton Loading for Hotels Page
 * Provides immediate visual feedback while the client-side bundle and data load.
 */
export default function HotelsLoading() {
  return (
    <div className="min-h-screen bg-background pt-24 pb-12 px-6 lg:px-12">
      <div className="max-w-7xl mx-auto space-y-12">
        {/* Header Skeleton */}
        <div className="space-y-8 text-center max-w-2xl mx-auto">
          <div className="space-y-4 flex flex-col items-center">
            <Skeleton className="h-12 w-3/4 bg-muted/40" />
            <Skeleton className="h-6 w-1/2 bg-muted/20" />
          </div>

          {/* Search Bar Skeleton */}
          <div className="flex flex-col md:flex-row gap-4 p-2 bg-card border border-border rounded-lg shadow-lg items-center">
            <div className="relative flex-1 w-full h-10 px-4 flex items-center gap-3">
              <Search className="w-4 h-4 text-muted/20" />
              <Skeleton className="h-4 w-1/2 bg-muted/20" />
            </div>
            <div className="w-px bg-border hidden md:block h-8" />
            <div className="relative flex-1 w-full h-10 px-4 flex items-center">
              <Skeleton className="h-4 w-1/2 bg-muted/20" />
            </div>
            <Skeleton className="md:w-32 w-full h-10 bg-primary/20 rounded-md" />
          </div>
        </div>

        {/* Results Grid Skeleton */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {[...Array(6)].map((_, i) => (
            <div
              key={i}
              className="bg-card border border-border rounded-lg overflow-hidden flex flex-col space-y-4 pb-6"
            >
              <Skeleton className="aspect-video w-full bg-muted/40" />
              <div className="px-5 space-y-3">
                <Skeleton className="h-6 w-3/4 bg-muted/30" />
                <Skeleton className="h-4 w-1/2 bg-muted/20" />
                <div className="pt-4 border-t border-border mt-auto flex justify-between">
                  <Skeleton className="h-5 w-24 bg-muted/20" />
                  <Skeleton className="h-5 w-16 bg-muted/20" />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
