import { Hotel } from '@/types/hotel.types';
import { Badge } from '@/components/ui/badge';
import { MapPin, Star, Wifi } from 'lucide-react';

/**
 * HotelCard Component
 * Modified to use <a> for hard-navigation diagnostic test.
 */
export function HotelCard({ hotel }: { hotel: Hotel }) {
  const startingPrice =
    hotel.rooms && hotel.rooms.length > 0
      ? Math.min(...hotel.rooms.map((r) => parseFloat(r.price)))
      : null;

  return (
    <a
      href={`/hotels/${hotel.id}`}
      className="group relative block overflow-hidden rounded-xl bg-card border border-border/50 shadow-lg transition-all hover:scale-[1.02] hover:shadow-xl hover:border-primary/50"
    >
      <div className="relative aspect-4/3 w-full overflow-hidden bg-muted">
        {hotel.images && hotel.images.length > 0 ? (
          <img
            src={hotel.images[0].url}
            alt={hotel.name}
            className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center bg-zinc-900 text-zinc-700">
            <span className="text-xs uppercase tracking-widest">No Image</span>
          </div>
        )}

        {startingPrice && (
          <div className="absolute bottom-4 right-4 bg-black/80 backdrop-blur-md px-3 py-1.5 text-white shadow-lg border border-white/10">
            <span className="text-xs text-muted-foreground uppercase mr-1">
              From
            </span>
            <span className="font-serif text-lg font-bold">
              ${startingPrice.toFixed(0)}
            </span>
            <span className="text-[10px] text-muted-foreground ml-1">
              / night
            </span>
          </div>
        )}
      </div>

      <div className="p-5 space-y-4">
        <div className="space-y-1">
          <div className="flex items-center justify-between">
            <h3 className="font-serif text-xl font-bold tracking-tight text-card-foreground group-hover:text-primary transition-colors">
              {hotel.name}
            </h3>
            {hotel.starRating > 0 && (
              <div className="flex items-center gap-1 text-yellow-500 text-xs font-bold bg-yellow-500/10 px-2 py-0.5 rounded-full">
                <Star className="w-3 h-3 fill-current" />
                {hotel.starRating}
              </div>
            )}
          </div>
          <p className="text-sm text-muted-foreground flex items-center gap-1.5">
            <MapPin className="w-3.5 h-3.5 text-primary" />
            {hotel.city}, {hotel.country}
          </p>
        </div>

        <div className="flex flex-wrap gap-2 pt-2 border-t border-border/50">
          {hotel.amenities && hotel.amenities.length > 0 ? (
            hotel.amenities.slice(0, 3).map((a) => (
              <Badge
                key={a.amenity.id}
                variant="secondary"
                className="text-[10px] px-2 py-0 bg-secondary/50"
              >
                {a.amenity.name}
              </Badge>
            ))
          ) : (
            <Badge
              variant="outline"
              className="text-[10px] border-border/50 text-muted-foreground"
            >
              <Wifi className="w-3 h-3 mr-1" /> Free WiFi
            </Badge>
          )}
        </div>
      </div>
    </a>
  );
}
