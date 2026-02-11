'use client';

import { useHotel } from '@/hooks/useHotels';
import { useParams } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Loader2, Hotel } from 'lucide-react';
import Link from 'next/link';

// Components
import { PropertyHeader } from './components/PropertyHeader';
import { PropertyGallery } from './components/PropertyGallery';
import { PropertyDescription } from './components/PropertyDescription';
import { PropertyAmenities } from './components/PropertyAmenities';
import { PropertyRoomsList } from './components/PropertyRoomsList';
import { PropertySidebar } from './components/PropertySidebar';

export default function PropertyDetailsPage() {
  const { id } = useParams<{ id: string }>();
  // Ensure id is a string before passing to useHotel
  const { data: hotel, isLoading, isError } = useHotel(id as string);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex flex-col items-center justify-center space-y-4">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
        <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground">
          Retrieving Estate Details...
        </p>
      </div>
    );
  }

  if (isError || !hotel) {
    return (
      <div className="min-h-screen bg-background flex flex-col items-center justify-center space-y-6">
        <div className="w-16 h-16 rounded-full bg-destructive/10 flex items-center justify-center">
          <Hotel className="w-8 h-8 text-destructive" />
        </div>
        <div className="text-center space-y-2">
          <h1 className="font-serif text-2xl font-medium">
            Property Not Found
          </h1>
          <p className="text-muted-foreground text-sm max-w-xs mx-auto">
            The estate you are looking for does not exist or has been removed.
          </p>
        </div>
        <Button asChild variant="outline">
          <Link href="/dashboard/host/properties">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Portfolio
          </Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background pt-24 pb-20 px-6 lg:px-12">
      <div className="max-w-6xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
        {/* --- HEADER --- */}
        <PropertyHeader hotel={hotel} />

        {/* --- MAIN LAYOUT GRID --- */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* LEFT COLUMN (Details) */}
          <div className="lg:col-span-2 space-y-8">
            {/* Gallery Section */}
            <PropertyGallery images={hotel.images} hotelName={hotel.name} />

            {/* Description */}
            <PropertyDescription description={hotel.description} />

            {/* Amenities Grid */}
            <PropertyAmenities amenities={hotel.amenities} />

            {/* Rooms Section */}
            <PropertyRoomsList rooms={hotel.rooms} hotelId={hotel.id} />
          </div>

          {/* RIGHT COLUMN (Sidebar Stats) */}
          <div className="sticky top-24 self-start">
            <PropertySidebar hotel={hotel} />
          </div>
        </div>
      </div>
    </div>
  );
}
