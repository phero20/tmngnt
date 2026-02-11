import { Sparkles, Zap } from 'lucide-react';
import { Hotel } from '@/types/hotel.types';

interface PropertyAmenitiesProps {
  amenities: Hotel['amenities'];
}

export function PropertyAmenities({ amenities }: PropertyAmenitiesProps) {
  return (
    <div className="space-y-4 pt-4 border-t border-border">
      <h2 className="font-serif text-lg font-medium flex items-center gap-2">
        <Sparkles className="w-4 h-4 text-primary" />
        Amenities & Features
      </h2>
      {amenities && amenities.length > 0 ? (
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
          {amenities.map((item) => (
            <div
              key={item.amenity.id}
              className="flex items-center gap-2 px-3 py-2 bg-card border border-border text-xs font-medium text-muted-foreground"
            >
              <Zap className="w-3 h-3 text-primary" />
              {item.amenity.name}
            </div>
          ))}
        </div>
      ) : (
        <p className="text-sm text-muted-foreground italic">
          No specific amenities listed.
        </p>
      )}
    </div>
  );
}
