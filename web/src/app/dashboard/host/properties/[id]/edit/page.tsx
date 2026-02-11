'use client';

import { useParams, useRouter } from 'next/navigation';
import { useHotel } from '@/hooks/useHotels';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Loader2 } from 'lucide-react';
import EditPropertyForm from '../components/EditPropertyForm';

export default function EditPropertyPage() {
  const router = useRouter();
  const { id } = useParams<{ id: string }>();
  const { data: hotel, isLoading, isError } = useHotel(id);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Loader2 className="w-8 h-8 text-primary animate-spin" />
      </div>
    );
  }

  if (isError || !hotel) {
    return (
      <div className="flex flex-col items-center justify-center h-screen gap-4">
        <h1 className="text-2xl font-serif">Property not found</h1>
        <Button variant="outline" onClick={() => router.back()}>
          Go Back
        </Button>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto space-y-8 p-6 pb-20">
      {/* Header */}
      <div className="flex items-center gap-4 border-b border-border pb-6">
        <Button
          variant="ghost"
          size="sm"
          className="rounded-full w-8 h-8 p-0"
          onClick={() => router.back()}
        >
          <ArrowLeft className="w-4 h-4" />
        </Button>
        <div>
          <h1 className="text-2xl font-serif font-medium tracking-tight">
            Edit Property
          </h1>
          <p className="text-muted-foreground text-sm font-sans mt-1">
            Update details for{' '}
            <span className="text-foreground">{hotel.name}</span>
          </p>
        </div>
      </div>

      <div className="bg-card border border-border rounded-xl p-6 md:p-8 shadow-sm">
        <EditPropertyForm hotel={hotel} />
      </div>
    </div>
  );
}
