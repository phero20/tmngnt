'use client';

import { useState } from 'react';
import { useSession } from '@/lib/auth-client';
import { useRouter, usePathname } from 'next/navigation';
import { useCreateBooking, useRoomAvailability } from '@/hooks/useBookings';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { CalendarIcon, Loader2 } from 'lucide-react';
import {
  format,
  differenceInDays,
  addDays,
  parseISO,
  isSameDay,
  isAfter,
  isBefore,
  eachDayOfInterval,
} from 'date-fns';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';
import { DateRange } from 'react-day-picker';

interface BookingModalProps {
  roomId: string;
  roomName: string;
  pricePerNight: number;
  quantity: number;
}

export function BookingModal({
  roomId,
  roomName,
  pricePerNight,
  quantity,
}: BookingModalProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [date, setDate] = useState<DateRange | undefined>();
  const [guests, setGuests] = useState({ adults: 1, children: 0 });
  const { data: session } = useSession();
  const router = useRouter();
  const pathname = usePathname();

  const { mutate: createBooking, isPending } = useCreateBooking();
  const { data: availability } = useRoomAvailability(roomId);

  const bookedIntervals =
    availability?.map((b: any) => ({
      start: parseISO(b.checkIn),
      end: parseISO(b.checkOut),
    })) || [];

  const isDateFullyBooked = (date: Date) => {
    const occupancy = bookedIntervals.filter((interval: any) => {
      const isAtOrAfterStart =
        isSameDay(date, interval.start) || isAfter(date, interval.start);
      const isBeforeEnd = isBefore(date, interval.end);
      return isAtOrAfterStart && isBeforeEnd;
    }).length;
    return occupancy >= quantity;
  };

  const handleBooking = () => {
    if (!date?.from || !date?.to) {
      toast.error('Please select check-in and check-out dates');
      return;
    }

    // Check if any date in the selected range is already fully booked
    const days = eachDayOfInterval({
      start: date.from,
      end: addDays(date.to, -1),
    });
    const isAnyDayFull = days.some((day) => isDateFullyBooked(day));

    if (isAnyDayFull) {
      toast.error('One or more of the selected dates are no longer available');
      return;
    }

    createBooking(
      {
        roomId,
        checkIn: format(date.from, 'yyyy-MM-dd'),
        checkOut: format(date.to, 'yyyy-MM-dd'),
        adults: guests.adults,
        children: guests.children,
      },
      {
        onSuccess: () => {
          setIsOpen(false);
          // Optional: Clear form state
        },
      }
    );
  };

  const nights =
    date?.from && date?.to ? differenceInDays(date.to, date.from) : 0;
  const totalPrice = nights * pricePerNight;

  if (!session?.user) {
    return (
      <Button
        variant="secondary"
        className="font-bold tracking-wide uppercase text-xs px-8"
        onClick={() =>
          router.push(
            `/login?callbackUrl=${encodeURIComponent(pathname || '/')}`
          )
        }
      >
        Sign in to Book
      </Button>
    );
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button className="font-bold tracking-wide uppercase text-xs px-8">
          Select Room
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Book {roomName}</DialogTitle>
          <DialogDescription>
            Enter your details to request a reservation.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-6 py-4">
          {/* Date Picker */}
          <div className="grid gap-2">
            <Label>Dates</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  id="date"
                  variant={'outline'}
                  className={cn(
                    'w-full justify-start text-left font-normal',
                    !date && 'text-muted-foreground'
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {date?.from ? (
                    date.to ? (
                      <>
                        {format(date.from, 'LLL dd, y')} -{' '}
                        {format(date.to, 'LLL dd, y')}
                      </>
                    ) : (
                      format(date.from, 'LLL dd, y')
                    )
                  ) : (
                    <span>Pick a date range</span>
                  )}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  initialFocus
                  mode="range"
                  defaultMonth={date?.from}
                  selected={date}
                  onSelect={setDate}
                  numberOfMonths={2}
                  disabled={(date) =>
                    (date < new Date() && !isSameDay(date, new Date())) ||
                    isDateFullyBooked(date)
                  }
                />
              </PopoverContent>
            </Popover>
          </div>

          {/* Guests */}
          <div className="grid grid-cols-2 gap-4">
            <div className="grid gap-2">
              <Label htmlFor="adults">Adults</Label>
              <Input
                id="adults"
                type="number"
                min={1}
                value={guests.adults}
                onChange={(e) =>
                  setGuests({
                    ...guests,
                    adults: parseInt(e.target.value) || 1,
                  })
                }
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="children">Children</Label>
              <Input
                id="children"
                type="number"
                min={0}
                value={guests.children}
                onChange={(e) =>
                  setGuests({
                    ...guests,
                    children: parseInt(e.target.value) || 0,
                  })
                }
              />
            </div>
          </div>

          {/* Pricing Summary */}
          {nights > 0 && (
            <div className="bg-secondary/50 p-4 rounded-lg space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">
                  ${pricePerNight} x {nights} nights
                </span>
                <span>${(pricePerNight * nights).toFixed(2)}</span>
              </div>
              <div className="flex justify-between font-bold border-t border-border pt-2 mt-2">
                <span>Total</span>
                <span>${totalPrice.toFixed(2)}</span>
              </div>
            </div>
          )}
        </div>
        <div className="flex justify-end gap-3">
          <Button variant="outline" onClick={() => setIsOpen(false)}>
            Cancel
          </Button>
          <Button onClick={handleBooking} disabled={isPending || nights <= 0}>
            {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Confirm Booking
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
