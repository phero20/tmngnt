'use client';

import { useHotel } from '@/hooks/useHotels';
import { useParams, useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Loader2, Hotel } from 'lucide-react';
import Link from 'next/link';
import EditRoomForm from '../../../components/EditRoomForm';
import { useEffect, useState } from 'react';
import { Room } from '@/types/hotel.types';

export default function EditRoomPage() {
  const { id: hotelId, roomId } = useParams<{ id: string; roomId: string }>();
  const { data: hotel, isLoading, isError } = useHotel(hotelId);
  const router = useRouter();

  const [selectedRoom, setSelectedRoom] = useState<Room | null>(null);

  useEffect(() => {
    if (hotel && hotel.rooms && roomId) {
      const room = hotel.rooms.find((r) => r.id === roomId);
      if (room) {
        setSelectedRoom(room);
      }
    }
  }, [hotel, roomId]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex flex-col items-center justify-center space-y-4">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
        <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground">
          Loading Room Details...
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
            Unable to retrieve the property details.
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

  if (!selectedRoom && !isLoading) {
    return (
      <div className="min-h-screen bg-background flex flex-col items-center justify-center space-y-6">
        <div className="text-center space-y-2">
          <h1 className="font-serif text-2xl font-medium">Room Not Found</h1>
          <p className="text-muted-foreground text-sm max-w-xs mx-auto">
            The room you are trying to edit does not exist.
          </p>
        </div>
        <Button asChild variant="outline">
          <Link href={`/dashboard/host/properties/${hotelId}`}>
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Property
          </Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background pt-24 pb-20 px-6 lg:px-12">
      <div className="max-w-2xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
        <div className="flex items-center gap-4">
          <Button asChild variant="ghost" size="icon" className="rounded-full">
            <Link href={`/dashboard/host/properties/${hotelId}`}>
              <ArrowLeft className="w-5 h-5" />
            </Link>
          </Button>
          <div className="space-y-1">
            <h1 className="font-serif text-2xl font-medium tracking-tight">
              Edit Room
            </h1>
            <p className="text-muted-foreground text-sm font-sans">
              Update details for{' '}
              <span className="text-foreground font-medium">
                {selectedRoom?.name}
              </span>{' '}
              at {hotel.name}
            </p>
          </div>
        </div>

        <div className="bg-card border border-border p-8 shadow-sm">
          {selectedRoom && (
            <EditRoomForm hotelId={hotelId} room={selectedRoom} />
          )}
        </div>
      </div>
    </div>
  );
}
