import { HotelsList } from '@/components/features/hotels/HotelsList';
import { Suspense } from 'react';
import HotelsLoading from './loading';

/**
 * HotelsPage (Server Component)
 * The root of the hotels list. We use Suspense to handle the separation
 * between the static shell and the dynamic list component.
 */
export default function HotelsPage() {
  return (
    <div className="min-h-screen bg-background pt-24 pb-12 px-6 lg:px-12 text-foreground">
      <Suspense fallback={<HotelsLoading />}>
        <HotelsList />
      </Suspense>
    </div>
  );
}

// revalidate: 0 is safer than force-dynamic in some dev environments
// to prevent infinite compilation loops while maintaining freshness.
export const revalidate = 0;
