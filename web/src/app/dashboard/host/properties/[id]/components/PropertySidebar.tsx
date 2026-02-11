import { MapPin, Clock, Phone } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Hotel } from '@/types/hotel.types';

interface PropertySidebarProps {
  hotel: Hotel;
}

export function PropertySidebar({ hotel }: PropertySidebarProps) {
  return (
    <div className="space-y-6">
      {/* Quick Stats Card */}
      <div className="bg-card border border-border p-6 space-y-6 shadow-sm">
        <h3 className="text-[10px] uppercase tracking-[0.2em] font-black text-primary mb-4">
          Property Details
        </h3>

        <div className="space-y-4">
          <div className="flex items-start gap-3">
            <MapPin className="w-4 h-4 text-muted-foreground mt-0.5" />
            <div>
              <p className="text-[10px] uppercase tracking-widest font-bold text-foreground">
                Address
              </p>
              <p className="text-sm text-muted-foreground">{hotel.address}</p>
              <p className="text-sm text-muted-foreground">
                {hotel.city}, {hotel.zipCode}
              </p>
              <p className="text-sm text-muted-foreground">{hotel.country}</p>
            </div>
          </div>

          <div className="w-full h-[1px] bg-border" />

          <div className="flex items-start gap-3">
            <Clock className="w-4 h-4 text-muted-foreground mt-0.5" />
            <div>
              <p className="text-[10px] uppercase tracking-widest font-bold text-foreground">
                Schedules
              </p>
              <p className="text-sm text-muted-foreground">
                Check-in:{' '}
                <span className="text-foreground font-medium">
                  {hotel.checkInTime}
                </span>
              </p>
              <p className="text-sm text-muted-foreground">
                Check-out:{' '}
                <span className="text-foreground font-medium">
                  {hotel.checkOutTime}
                </span>
              </p>
            </div>
          </div>

          <div className="w-full h-[1px] bg-border" />

          <div className="flex items-start gap-3">
            <Phone className="w-4 h-4 text-muted-foreground mt-0.5" />
            <div>
              <p className="text-[10px] uppercase tracking-widest font-bold text-foreground">
                Contact
              </p>
              <p className="text-sm text-muted-foreground">
                {hotel.contactPhone}
              </p>
              <p className="text-sm text-muted-foreground truncate max-w-[200px]">
                {hotel.contactEmail}
              </p>
            </div>
          </div>
        </div>

        <div className="pt-4 mt-4">
          <Button className="w-full rounded-none uppercase tracking-widest text-[10px] font-black h-10">
            Manage Availability
          </Button>
        </div>
      </div>

      {/* Status Card */}
      <div className="bg-primary/5 border border-primary/20 p-6 flex flex-col items-center justify-center text-center space-y-2">
        <div className="w-2 h-2 rounded-full bg-primary animate-pulse mb-2" />
        <p className="text-[10px] uppercase tracking-widest font-bold text-primary">
          Operating Status
        </p>
        <p className="text-2xl font-serif font-medium">Active</p>
      </div>
    </div>
  );
}
