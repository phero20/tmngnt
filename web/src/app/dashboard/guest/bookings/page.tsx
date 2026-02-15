'use client';

import { useState } from 'react';
import { useMyBookings } from '@/hooks/useBookings';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Loader2,
  Calendar,
  CreditCard,
  RotateCcw,
  MapPin,
  Home,
} from 'lucide-react';
import { format } from 'date-fns';
import Link from 'next/link';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { useCancelBooking } from '@/hooks/useBookings';

export default function GuestBookingsPage() {
  const { data: bookings, isLoading, error, refetch } = useMyBookings();
  const { mutate: cancelBooking, isPending: isCancelling } = useCancelBooking();

  const [activeTab, setActiveTab] = useState<
    'all' | 'pending' | 'confirmed' | 'completed' | 'cancelled'
  >('all');

  const filteredBookings = bookings?.filter((booking) => {
    if (activeTab === 'all') return true;
    return booking.status.toLowerCase() === activeTab;
  });

  const getStatusBadgeVariant = (status: string) => {
    switch (status) {
      case 'CONFIRMED':
        return 'success';
      case 'COMPLETED':
        return 'info';
      case 'CANCELLED':
        return 'destructive';
      case 'PENDING':
        return 'warning';
      default:
        return 'default';
    }
  };

  const getPaymentBadgeVariant = (status: string) => {
    switch (status) {
      case 'PAID':
        return 'success';
      case 'REFUNDED':
        return 'destructive';
      case 'FAILED':
        return 'destructive';
      case 'PENDING':
        return 'warning';
      default:
        return 'default';
    }
  };

  const formatDate = (dateStr: string) => {
    try {
      return format(new Date(dateStr), 'MMM dd, yyyy');
    } catch {
      return dateStr;
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen pt-24 pb-12 px-6 flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen pt-24 pb-12 px-6 flex flex-col items-center justify-center space-y-4">
        <p className="text-destructive font-bold">
          Failed to load your bookings
        </p>
        <Button variant="outline" onClick={() => refetch()}>
          Try Again
        </Button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background pt-24 pb-12 px-6 lg:px-12">
      <div className="max-w-7xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-1">
            <h1 className="font-serif text-3xl font-medium tracking-tight">
              My Stays
            </h1>
            <p className="text-muted-foreground text-sm font-sans">
              Track your upcoming trips and past getaways
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              onClick={() => refetch()}
              title="Refresh List"
            >
              <RotateCcw className="w-4 h-4" />
            </Button>
            {/* Link to browse more properties */}
            <Button asChild>
              <Link href="/">Browse Hotels</Link>
            </Button>
          </div>
        </div>

        {/* Filters */}
        <div className="flex space-x-2 overflow-x-auto pb-2">
          {['all', 'pending', 'confirmed', 'completed', 'cancelled'].map(
            (tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab as any)}
                className={`px-4 py-2 rounded-full text-xs font-bold uppercase tracking-wide transition-all ${
                  activeTab === tab
                    ? 'bg-primary text-primary-foreground shadow-md'
                    : 'bg-muted text-muted-foreground hover:bg-muted/80'
                }`}
              >
                {tab}
              </button>
            )
          )}
        </div>

        {/* List */}
        {!filteredBookings || filteredBookings.length === 0 ? (
          <div className="border border-dashed border-border rounded-lg p-12 flex flex-col items-center justify-center text-center space-y-4 bg-card/50">
            <Calendar className="w-12 h-12 text-muted-foreground/20" />
            <p className="text-muted-foreground text-sm">
              No {activeTab === 'all' ? '' : activeTab} bookings found.
            </p>
            {activeTab === 'all' && (
              <Button asChild variant="outline">
                <Link href="/">Start Planning Your Trip</Link>
              </Button>
            )}
          </div>
        ) : (
          <div className="grid gap-6">
            {filteredBookings.map((booking) => (
              <div
                key={booking.id}
                className="bg-card border border-border rounded-lg overflow-hidden flex flex-col md:flex-row shadow-sm hover:border-primary/30 transition-all group"
              >
                {/* Image / Thumbnail Section (if hotel has images) */}
                <div className="relative w-full md:w-48 h-32 md:h-auto bg-muted">
                  {booking.hotel?.images && booking.hotel.images.length > 0 ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={booking.hotel.images[0].url}
                      alt={booking.hotel.name}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-muted-foreground">
                      <Home className="w-8 h-8 opacity-20" />
                    </div>
                  )}
                </div>

                {/* Content Section */}
                <div className="flex-1 p-6 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
                  <div className="space-y-4 flex-1">
                    <div className="flex items-start justify-between lg:justify-start lg:gap-4">
                      <Badge
                        variant={getStatusBadgeVariant(booking.status) as any}
                      >
                        {booking.status}
                      </Badge>
                      <Badge
                        variant={
                          getPaymentBadgeVariant(booking.paymentStatus) as any
                        }
                        className="bg-transparent border border-border"
                      >
                        <CreditCard className="w-3 h-3 mr-1" />
                        {booking.paymentStatus}
                      </Badge>
                    </div>

                    <div>
                      <h3 className="font-serif text-xl font-medium">
                        {booking.hotel?.name || 'Unknown Hotel'}
                      </h3>
                      <p className="text-sm text-muted-foreground flex items-center gap-1 mt-1">
                        <MapPin className="w-3 h-3" />
                        {booking.hotel?.city || 'City'},{' '}
                        {booking.hotel?.slug || 'Country'}
                      </p>
                    </div>

                    <div className="flex items-center gap-6 text-sm text-muted-foreground">
                      <span className="flex items-center gap-2">
                        <Calendar className="w-4 h-4" />
                        {formatDate(booking.checkIn)} —{' '}
                        {formatDate(booking.checkOut)}
                      </span>
                      <span className="flex items-center gap-2">
                        <Home className="w-4 h-4" />
                        {booking.room?.name || 'Room'}
                      </span>
                    </div>
                  </div>

                  {/* Price & Actions */}
                  <div className="flex flex-col items-start lg:items-end justify-between gap-4 border-t lg:border-t-0 lg:border-l border-border pt-4 lg:pt-0 lg:pl-6">
                    <div className="text-left lg:text-right">
                      <p className="text-2xl font-serif font-medium">
                        ${booking.totalPrice}
                      </p>
                      <p className="text-xs text-muted-foreground uppercase tracking-wider font-bold">
                        Total Price
                      </p>
                    </div>

                    <div className="flex items-center gap-2">
                      {/* Future: Add "View Details" or "Cancel" if applicable */}
                      {booking.status === 'PENDING' && (
                        <div className="flex flex-col items-end gap-2">
                          <span className="text-xs text-yellow-500 font-bold">
                            Awaiting Confirmation
                          </span>
                          <AlertDialog>
                            <AlertDialogTrigger asChild>
                              <Button
                                variant="destructive"
                                size="sm"
                                className="h-8 text-xs font-bold uppercase tracking-wide"
                              >
                                Cancel Booking
                              </Button>
                            </AlertDialogTrigger>
                            <AlertDialogContent>
                              <AlertDialogHeader>
                                <AlertDialogTitle>
                                  Cancel Reservation?
                                </AlertDialogTitle>
                                <AlertDialogDescription>
                                  Are you sure you want to cancel this booking?
                                  This action cannot be undone.
                                </AlertDialogDescription>
                              </AlertDialogHeader>
                              <AlertDialogFooter>
                                <AlertDialogCancel>
                                  Keep Reservation
                                </AlertDialogCancel>
                                <AlertDialogAction
                                  onClick={() => cancelBooking(booking.id)}
                                  className="bg-destructive hover:bg-destructive/90"
                                >
                                  Yes, Cancel
                                </AlertDialogAction>
                              </AlertDialogFooter>
                            </AlertDialogContent>
                          </AlertDialog>
                        </div>
                      )}
                      {booking.status === 'CONFIRMED' && (
                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <Button
                              variant="outline"
                              size="sm"
                              className="h-8 text-xs font-bold uppercase tracking-wide border-destructive text-destructive hover:bg-destructive/10"
                            >
                              Cancel Booking
                            </Button>
                          </AlertDialogTrigger>
                          <AlertDialogContent>
                            <AlertDialogHeader>
                              <AlertDialogTitle>
                                Cancel Reservation?
                              </AlertDialogTitle>
                              <AlertDialogDescription>
                                Are you sure you want to cancel this booking?
                                Cancellation fees may apply according to the
                                hotel policy.
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>
                                Keep Reservation
                              </AlertDialogCancel>
                              <AlertDialogAction
                                onClick={() => cancelBooking(booking.id)}
                                className="bg-destructive hover:bg-destructive/90"
                              >
                                Yes, Cancel
                              </AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
