'use client';

import { useParams } from 'next/navigation';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import RoomForm from '../../components/RoomForm';

export default function NewRoomPage() {
  const { id } = useParams<{ id: string }>();

  return (
    <div className="min-h-screen bg-background pt-24 pb-20 px-6 lg:px-12">
      <div className="max-w-2xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
        <div className="flex items-center gap-4">
          <Button asChild variant="ghost" size="icon" className="rounded-full">
            <Link href={`/dashboard/host/properties/${id}`}>
              <ArrowLeft className="w-5 h-5" />
            </Link>
          </Button>
          <div>
            <h1 className="font-serif text-2xl font-medium tracking-tight">
              Add New Room
            </h1>
            <p className="text-sm text-muted-foreground">
              Define the details for this room type.
            </p>
          </div>
        </div>

        <div className="bg-card border border-border p-6 rounded-lg shadow-sm">
          <RoomForm hotelId={id as string} />
        </div>
      </div>
    </div>
  );
}
