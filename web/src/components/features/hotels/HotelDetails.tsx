'use client';

import { useHotel } from '@/hooks/useHotels';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  MapPin,
  Star,
  Users,
  Clock,
  Home,
  Loader2,
  Calendar,
  CreditCard,
} from 'lucide-react';
import Link from 'next/link';
import { BookingModal } from '@/components/features/bookings/BookingModal';
import { DynamicIcon } from '@/components/shared/DynamicIcon';
import type { Hotel } from '@/types/hotel.types';

interface HotelDetailsProps {
  initialData: Hotel;
}

/**
 * HotelDetails Client Component
 * Optimized to prevent hydration hangs and navigation delays.
 */
export function HotelDetails({ initialData }: HotelDetailsProps) {
  // Use initialData as the source of truth to prevent the 'Wait' during hydration.
  // We only use the hook for background updates.
  const { data: hotel, error } = useHotel(initialData.id);

  const displayData = hotel || initialData;

  if (error) {
    return (
      <div className="min-h-screen pt-24 pb-12 px-6 flex flex-col items-center justify-center space-y-4 text-center">
        <h1 className="text-2xl font-serif">Property Error</h1>
        <p className="text-muted-foreground">
          Something went wrong while loading the latest property data.
        </p>
        <Button asChild variant="outline">
          <Link href="/hotels">Return to Listings</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background pb-20 text-foreground">
      {/* Hero Section with Image */}
      <div className="relative h-[70vh] w-full overflow-hidden bg-muted">
        {displayData.images && displayData.images.length > 0 ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={displayData.images[0].url}
            alt={displayData.name}
            className="h-full w-full object-cover"
          />
        ) : (
          <div className="h-full w-full flex items-center justify-center bg-zinc-900 text-zinc-600">
            <span className="uppercase tracking-widest text-sm">
              No Image Available
            </span>
          </div>
        )}
        <div className="absolute inset-0 bg-linear-to-t from-background via-black/20 to-black/10" />

        <div className="absolute bottom-0 left-0 right-0 p-6 lg:p-12 max-w-7xl mx-auto space-y-4">
          <div className="flex flex-wrap items-center gap-3">
            {displayData.starRating > 0 && (
              <div className="inline-flex items-center gap-1 bg-yellow-500/90 text-black px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider backdrop-blur-sm">
                <Star className="w-3.5 h-3.5 fill-current" />
                {displayData.starRating} Star Hotel
              </div>
            )}
            <div className="bg-primary/90 text-primary-foreground px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider backdrop-blur-sm">
              Verified Property
            </div>
          </div>
          <h1 className="font-serif text-4xl md:text-7xl font-medium tracking-tight text-white drop-shadow-xl">
            {displayData.name}
          </h1>
          <p className="flex items-center gap-2 text-white/90 text-sm md:text-lg font-medium drop-shadow-lg">
            <MapPin className="w-5 h-5 text-primary" />
            {displayData.address}, {displayData.city}, {displayData.country}
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 lg:px-12 py-12 grid grid-cols-1 lg:grid-cols-3 gap-12">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-16">
          {/* Description */}
          <div className="space-y-6">
            <div className="space-y-2">
              <h2 className="font-serif text-3xl font-medium">
                About this stay
              </h2>
              <div className="h-1 w-16 bg-primary rounded-full" />
            </div>
            <p className="text-muted-foreground text-lg leading-relaxed whitespace-pre-wrap font-serif italic">
              {displayData.description ||
                'No description provided for this property.'}
            </p>

            {/* Quick Info Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-8 py-8 border-y border-border/50">
              <div className="space-y-1">
                <span className="text-[10px] text-muted-foreground uppercase tracking-[0.2em] font-bold">
                  Check-in
                </span>
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4 text-primary" />
                  <span className="font-medium text-base">
                    {displayData.checkInTime}
                  </span>
                </div>
              </div>
              <div className="space-y-1">
                <span className="text-[10px] text-muted-foreground uppercase tracking-[0.2em] font-bold">
                  Check-out
                </span>
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4 text-primary" />
                  <span className="font-medium text-base">
                    {displayData.checkOutTime}
                  </span>
                </div>
              </div>
              <div className="space-y-1">
                <span className="text-[10px] text-muted-foreground uppercase tracking-[0.2em] font-bold">
                  Contact
                </span>
                <div className="flex items-center gap-2 truncate">
                  <span className="font-medium text-base">
                    {displayData.contactPhone || 'N/A'}
                  </span>
                </div>
              </div>
              <div className="space-y-1">
                <span className="text-[10px] text-muted-foreground uppercase tracking-[0.2em] font-bold">
                  Support
                </span>
                <div className="flex items-center gap-2 truncate">
                  <a
                    href={`mailto:${displayData.contactEmail || ''}`}
                    className="font-medium text-base text-primary hover:underline cursor-pointer"
                  >
                    Email Us
                  </a>
                </div>
              </div>
            </div>
          </div>

          {/* Amenities */}
          <div className="space-y-8">
            <div className="space-y-2">
              <h2 className="font-serif text-3xl font-medium">Amenities</h2>
              <div className="h-1 w-16 bg-primary rounded-full" />
            </div>

            {displayData.amenities && displayData.amenities.length > 0 ? (
              <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
                {displayData.amenities.map((a) => (
                  <div
                    key={a.amenity.id}
                    className="flex items-center gap-4 group"
                  >
                    <div className="p-3 rounded-2xl bg-secondary/50 text-primary group-hover:bg-primary group-hover:text-primary-foreground transition-all duration-300">
                      <DynamicIcon
                        name={a.amenity.icon || a.amenity.name}
                        className="w-5 h-5"
                      />
                    </div>
                    <span className="font-medium text-sm text-foreground/80">
                      {a.amenity.name}
                    </span>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-muted-foreground text-sm italic">
                Standard luxury amenities included.
              </p>
            )}
          </div>

          {/* Rooms Section */}
          <div id="rooms" className="space-y-10 pt-8">
            <div className="space-y-2">
              <h2 className="font-serif text-3xl font-medium">
                Luxury Accommodations
              </h2>
              <div className="h-1 w-16 bg-primary rounded-full" />
            </div>

            <div className="grid gap-8">
              {displayData.rooms?.map((room) => (
                <div
                  key={room.id}
                  className="group overflow-hidden rounded-2xl border border-border/50 bg-card hover:border-primary/50 transition-all duration-500 shadow-sm hover:shadow-2xl flex flex-col md:flex-row"
                >
                  <div className="md:w-[40%] bg-muted h-64 md:h-auto overflow-hidden relative">
                    <div className="absolute inset-0 bg-black/20" />
                    <Home className="absolute inset-0 m-auto w-12 h-12 text-white/10" />
                    <div className="absolute top-4 left-4">
                      <Badge className="bg-white/90 text-black border-none hover:bg-white text-[10px] font-bold">
                        {room.quantity} Available
                      </Badge>
                    </div>
                  </div>

                  <div className="p-8 flex-1 flex flex-col justify-between gap-8">
                    <div className="space-y-4">
                      <div className="flex justify-between items-start">
                        <h3 className="font-serif text-2xl font-medium tracking-tight">
                          {room.name}
                        </h3>
                        <div className="text-right">
                          <span className="text-3xl font-serif font-medium text-primary">
                            ${parseFloat(room.price).toFixed(0)}
                          </span>
                          <p className="text-[10px] text-muted-foreground font-bold uppercase tracking-widest mt-1">
                            Per Night
                          </p>
                        </div>
                      </div>
                      <p className="text-muted-foreground leading-relaxed">
                        {room.description ||
                          'Experience ultimate comfort in our meticulously designed space.'}
                      </p>

                      <div className="flex flex-wrap items-center gap-3 pt-2">
                        <div className="flex items-center gap-2 px-3 py-1.5 bg-secondary/50 rounded-full text-xs font-bold uppercase tracking-tighter">
                          <Users className="w-3.5 h-3.5 text-primary" />
                          Up to {room.capacityAdults +
                            room.capacityChildren}{' '}
                          Guests
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center justify-between pt-6 border-t border-border/50">
                      <div className="text-xs text-muted-foreground italic">
                        Instant confirmation
                      </div>
                      <BookingModal
                        roomId={room.id}
                        roomName={room.name}
                        pricePerNight={parseFloat(room.price)}
                        quantity={room.quantity}
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="hidden lg:block">
          <div className="sticky top-24 rounded-xl border border-border bg-card p-6 shadow-xl space-y-6">
            <h3 className="font-serif text-xl border-b border-border pb-4">
              Reservation
            </h3>
            <Button
              className="w-full h-12 text-sm font-bold uppercase tracking-widest"
              onClick={() => {
                document
                  .getElementById('rooms')
                  ?.scrollIntoView({ behavior: 'smooth' });
              }}
            >
              Check Availability
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
