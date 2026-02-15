'use client';

import { useState, useMemo } from 'react';
import { useHotels } from '@/hooks/useHotels';
import { HotelCard } from '@/components/features/hotels/HotelCard';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Loader2, Search, MapPin, FilterX } from 'lucide-react';

/**
 * HotelsList Component
 * Client-side component for searching and displaying hotels.
 */
export function HotelsList() {
  const [search, setSearch] = useState('');
  const [city, setCity] = useState('');

  const [appliedFilters, setAppliedFilters] = useState({
    search: '',
    city: '',
  });

  // Stabilize params object to prevent React Query from thinking the key changed every render
  const queryParams = useMemo(
    () => ({
      search: appliedFilters.search,
      city: appliedFilters.city,
      archived: false,
    }),
    [appliedFilters.search, appliedFilters.city]
  );

  const {
    data: hotels,
    isLoading,
    isRefetching,
    error,
  } = useHotels(queryParams);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setAppliedFilters({ search, city });
  };

  const clearFilters = () => {
    setSearch('');
    setCity('');
    setAppliedFilters({ search: '', city: '' });
  };

  return (
    <div className="max-w-7xl mx-auto space-y-12 animate-in fade-in slide-in-from-bottom-4 duration-700">
      {/* Header & Search */}
      <div className="space-y-8 text-center max-w-2xl mx-auto">
        <div className="space-y-4">
          <h1 className="font-serif text-4xl md:text-5xl font-medium tracking-tight">
            Find Your Sanctuary
          </h1>
          <p className="text-muted-foreground font-sans text-lg">
            Explore our curated collection of luxury properties across the
            globe.
          </p>
        </div>

        <form
          onSubmit={handleSearch}
          className="flex flex-col md:flex-row gap-4 p-2 bg-card border border-border rounded-lg shadow-lg"
        >
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Search hotels..."
              className="pl-9 border-0 bg-transparent focus-visible:ring-0"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <div className="w-px bg-border hidden md:block" />
          <div className="relative flex-1">
            <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="City or Location"
              className="pl-9 border-0 bg-transparent focus-visible:ring-0"
              value={city}
              onChange={(e) => setCity(e.target.value)}
            />
          </div>
          <Button
            type="submit"
            className="md:w-32 font-bold tracking-wide uppercase text-xs"
            disabled={isLoading || isRefetching}
          >
            {isLoading || isRefetching ? (
              <Loader2 className="w-4 h-4 animate-spin mx-auto" />
            ) : (
              'Search'
            )}
          </Button>
        </form>
        {(appliedFilters.search || appliedFilters.city) && (
          <div className="flex justify-center">
            <Button
              variant="ghost"
              size="sm"
              onClick={clearFilters}
              className="text-muted-foreground hover:text-destructive"
            >
              <FilterX className="w-3 h-3 mr-2" />
              Clear Filters
            </Button>
          </div>
        )}
      </div>

      {/* Results Grid */}
      <div className="space-y-6">
        {isLoading ? (
          <div className="flex items-center justify-center py-24">
            <Loader2 className="w-8 h-8 animate-spin text-primary" />
          </div>
        ) : error ? (
          <div className="text-center py-24 space-y-4">
            <p className="text-destructive font-bold">Unable to load hotels.</p>
            <Button variant="outline" onClick={() => window.location.reload()}>
              Try Again
            </Button>
          </div>
        ) : !hotels || hotels.length === 0 ? (
          <div className="text-center py-24 space-y-4 border border-dashed border-border rounded-xl bg-card/30">
            <MapPin className="w-12 h-12 text-muted-foreground/20 mx-auto" />
            <h3 className="text-xl font-serif">No properties found</h3>
            <p className="text-muted-foreground">
              Try adjusting your search criteria
            </p>
            <Button variant="link" onClick={clearFilters}>
              View All Hotels
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {hotels.map((hotel) => (
              <HotelCard key={hotel.id} hotel={hotel} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
