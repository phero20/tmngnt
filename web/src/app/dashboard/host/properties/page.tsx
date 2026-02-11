'use client';

import { useState } from 'react';
import { useHotels, useRestoreHotel } from '@/hooks/useHotels';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import {
  Plus,
  Hotel as HotelIcon,
  MapPin,
  Star,
  Loader2,
  ChevronRight,
  Search,
  SlidersHorizontal,
  RotateCcw,
} from 'lucide-react';
import Link from 'next/link';
import type { Hotel } from '@/types/hotel.types';

export default function PropertiesPage() {
  const [view, setView] = useState<'active' | 'archived'>('active');

  const { data, isLoading, error } = useHotels({
    archived: view === 'archived',
  });

  const { mutate: restoreHotel, isPending: isRestoring } = useRestoreHotel();

  return (
    <div className="min-h-screen bg-background pt-24 pb-12 px-6 lg:px-12">
      <div className="max-w-7xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
        {/* --- HEADER --- */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-1">
            <h1 className="font-serif text-3xl font-medium tracking-tight">
              Property Portfolio
            </h1>
            <p className="text-muted-foreground text-sm font-sans flex items-center gap-2">
              Manage your estates and archived properties
              <span className="inline-flex h-1.5 w-1.5 rounded-full bg-primary" />
              <span className="text-foreground font-medium">
                {data?.length || 0} {view === 'active' ? 'Active' : 'Archived'}
              </span>
            </p>
          </div>
          <Button
            asChild
            className="rounded-none h-11 px-8 font-bold tracking-wide shadow-[0_0_20px_hsl(var(--primary)/0.2)]"
          >
            <Link href="/dashboard/host/properties/new">
              <Plus className="w-4 h-4 mr-2" />
              Add Property
            </Link>
          </Button>
        </div>

        {/* --- TABS & FILTERS --- */}
        <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
          {/* Tabs */}
          <div className="flex p-1 bg-muted rounded-lg">
            <button
              onClick={() => setView('active')}
              className={cn(
                'px-4 py-2 text-sm font-medium rounded-md transition-all',
                view === 'active'
                  ? 'bg-background shadow-sm text-foreground'
                  : 'text-muted-foreground hover:text-foreground'
              )}
            >
              Active Properties
            </button>
            <button
              onClick={() => setView('archived')}
              className={cn(
                'px-4 py-2 text-sm font-medium rounded-md transition-all',
                view === 'archived'
                  ? 'bg-background shadow-sm text-foreground'
                  : 'text-muted-foreground hover:text-foreground'
              )}
            >
              Archived
            </button>
          </div>

          <div className="flex gap-2 w-full sm:w-auto">
            <div className="relative flex-1 sm:w-64 group">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <input
                type="text"
                placeholder="Search..."
                className="w-full bg-card border border-border pl-9 pr-4 py-2 text-sm rounded-md focus:outline-none focus:border-primary transition-all"
              />
            </div>
          </div>
        </div>

        {/* --- CONTENT --- */}
        {isLoading ? (
          <div className="h-[400px] flex flex-col items-center justify-center space-y-4 border border-dashed border-border bg-card/10 rounded-lg">
            <Loader2 className="w-8 h-8 animate-spin text-primary" />
            <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground">
              Retrieving Data...
            </p>
          </div>
        ) : error ? (
          <div className="h-[400px] flex flex-col items-center justify-center space-y-4 border border-destructive/20 bg-destructive/5 rounded-lg">
            <p className="text-destructive font-bold">
              Failed to load properties
            </p>
            <Button variant="outline" onClick={() => window.location.reload()}>
              Try Again
            </Button>
          </div>
        ) : data?.length === 0 ? (
          <div className="h-[300px] flex flex-col items-center justify-center text-center p-8 border border-dashed border-border rounded-lg bg-card/50 space-y-4">
            <div className="w-12 h-12 rounded-full bg-muted flex items-center justify-center">
              <HotelIcon className="w-6 h-6 text-muted-foreground" />
            </div>
            <p className="text-muted-foreground text-sm">
              No {view} properties found.
            </p>
            {view === 'active' && (
              <Button asChild variant="outline" size="sm">
                <Link href="/dashboard/host/properties/new">Add Property</Link>
              </Button>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {data?.map((hotel) => (
              <div
                key={hotel.id}
                className="group relative bg-card border border-border rounded-lg overflow-hidden flex flex-col hover:border-primary/30 hover:shadow-lg transition-all"
              >
                {/* Image */}
                <div className="aspect-video bg-muted overflow-hidden relative">
                  {hotel.images && hotel.images[0] ? (
                    <img
                      src={hotel.images[0].url}
                      alt={hotel.name}
                      className={cn(
                        'w-full h-full object-cover transition-transform duration-700',
                        view === 'active' && 'group-hover:scale-110',
                        view === 'archived' && 'grayscale opacity-70'
                      )}
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-gray-100 dark:bg-gray-800">
                      <HotelIcon className="w-10 h-10 text-muted-foreground/20" />
                    </div>
                  )}

                  {view === 'active' && (
                    <div className="absolute top-3 right-3 bg-black/60 backdrop-blur-md px-2 py-1 rounded-md flex items-center gap-1">
                      <Star className="w-3 h-3 text-primary fill-primary" />
                      <span className="text-[10px] font-bold text-white">
                        {hotel.starRating || 0}
                      </span>
                    </div>
                  )}
                  {view === 'archived' && (
                    <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                      <span className="text-white font-bold tracking-widest uppercase text-sm border-2 border-white px-3 py-1 bg-black/20 backdrop-blur-sm">
                        Archived
                      </span>
                    </div>
                  )}
                </div>

                {/* Info */}
                <div className="p-5 flex-1 flex flex-col space-y-3">
                  <div className="flex-1">
                    <h3 className="font-serif text-lg font-medium truncate">
                      {hotel.name}
                    </h3>
                    <p className="text-muted-foreground text-xs flex items-center gap-1 mt-1">
                      <MapPin className="w-3 h-3" /> {hotel.city},{' '}
                      {hotel.country}
                    </p>
                  </div>

                  {/* Action Footer */}
                  <div className="pt-4 border-t border-border mt-auto">
                    {view === 'active' ? (
                      <Link
                        href={`/dashboard/host/properties/${hotel.id}`}
                        className="flex items-center justify-between text-sm font-medium text-primary hover:text-primary/80"
                      >
                        Manage Property
                        <ChevronRight className="w-4 h-4" />
                      </Link>
                    ) : (
                      <Button
                        variant="outline"
                        className="w-full gap-2 border-dashed"
                        onClick={() => restoreHotel(hotel.id)}
                        disabled={isRestoring}
                      >
                        {isRestoring ? (
                          <Loader2 className="w-4 h-4 animate-spin" />
                        ) : (
                          <RotateCcw className="w-4 h-4 text-green-600" />
                        )}
                        Restore Property
                      </Button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
