import { ArrowLeft, MapPin, Star, Pencil } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Hotel } from '@/types/hotel.types';

interface PropertyHeaderProps {
  hotel: Hotel;
}

export function PropertyHeader({ hotel }: PropertyHeaderProps) {
  return (
    <div className="flex items-center gap-4 mb-8">
      <Button asChild variant="ghost" size="icon" className="rounded-full">
        <Link href="/dashboard/host/properties">
          <ArrowLeft className="w-5 h-5" />
        </Link>
      </Button>
      <div className="space-y-1">
        <h1 className="font-serif text-3xl font-medium tracking-tight">
          {hotel.name}
        </h1>
        <div className="flex items-center gap-4 text-xs font-bold uppercase tracking-widest text-muted-foreground">
          <span className="flex items-center gap-1">
            <MapPin className="w-3 h-3" /> {hotel.city}, {hotel.country}
          </span>
          <span className="flex items-center gap-1 text-primary">
            <Star className="w-3 h-3 fill-primary" /> {hotel.starRating} Stars
          </span>
        </div>
      </div>

      <div className="flex-1" />

      <Button
        asChild
        variant="outline"
        size="sm"
        className="hidden sm:inline-flex"
      >
        <Link href={`/dashboard/host/properties/${hotel.id}/edit`}>
          <Pencil className="w-4 h-4 mr-2" />
          Edit Property
        </Link>
      </Button>
    </div>
  );
}
