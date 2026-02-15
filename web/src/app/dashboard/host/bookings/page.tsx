'use client';

import { useState } from 'react';
import {
  useHotelBookings,
  useUpdateBookingStatus,
  useUpdatePaymentStatus,
} from '@/hooks/useBookings';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Loader2,
  Calendar,
  CheckCircle2,
  XCircle,
  Clock,
  CreditCard,
  RotateCcw,
  ShieldCheck,
} from 'lucide-react';
import { format } from 'date-fns';

export default function BookingsPage() {
  const { data: bookings, isLoading, error, refetch } = useHotelBookings();
  const { mutate: updateStatus, isPending: isUpdatingStatus } =
    useUpdateBookingStatus();
  const { mutate: updatePayment, isPending: isUpdatingPayment } =
    useUpdatePaymentStatus();

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
        <p className="text-destructive font-bold">Failed to load bookings</p>
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
              Reservations
            </h1>
            <p className="text-muted-foreground text-sm font-sans">
              Manage incoming bookings and guest status
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
            {/* Logic for Export or Stats could go here */}
          </div>
        </div>

        {/* Stats Summary */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {[
            {
              label: 'Total Revenue',
              value: `$${bookings
                ?.filter((b) => b.status !== 'CANCELLED')
                .reduce((acc, b) => acc + parseFloat(b.totalPrice), 0)
                .toLocaleString()}`,
              icon: CreditCard,
              color: 'text-blue-600',
              bg: 'bg-blue-50',
            },
            {
              label: 'Pending',
              value:
                bookings?.filter((b) => b.status === 'PENDING').length || 0,
              icon: Clock,
              color: 'text-amber-600',
              bg: 'bg-amber-50',
            },
            {
              label: 'Confirmed',
              value:
                bookings?.filter((b) => b.status === 'CONFIRMED').length || 0,
              icon: CheckCircle2,
              color: 'text-green-600',
              bg: 'bg-green-50',
            },
            {
              label: 'Completed',
              value:
                bookings?.filter((b) => b.status === 'COMPLETED').length || 0,
              icon: ShieldCheck,
              iconName: 'ShieldCheck', // Fallback note
              color: 'text-indigo-600',
              bg: 'bg-indigo-50',
            },
          ].map((stat, i) => (
            <div
              key={i}
              className="bg-card border border-border p-6 rounded-2xl flex items-center gap-4 shadow-sm hover:shadow-md transition-all hover:-translate-y-1"
            >
              <div className={`p-4 rounded-xl ${stat.bg} ${stat.color}`}>
                <stat.icon className="w-6 h-6" />
              </div>
              <div className="space-y-1">
                <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground">
                  {stat.label}
                </p>
                <p className="text-2xl font-serif font-medium">{stat.value}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Filters */}
        <div className="flex items-center justify-between border-b border-border pb-4">
          <div className="flex space-x-2 overflow-x-auto pb-1 scrollbar-hide">
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
          <p className="text-xs text-muted-foreground font-medium hidden md:block">
            Showing {filteredBookings?.length || 0} results
          </p>
        </div>

        {/* List */}
        {!filteredBookings || filteredBookings.length === 0 ? (
          <div className="border border-dashed border-border rounded-lg p-12 flex flex-col items-center justify-center text-center space-y-4 bg-card/50">
            <Calendar className="w-12 h-12 text-muted-foreground/20" />
            <p className="text-muted-foreground text-sm">
              No {activeTab === 'all' ? '' : activeTab} bookings found.
            </p>
          </div>
        ) : (
          <div className="grid gap-4">
            {filteredBookings.map((booking) => (
              <div
                key={booking.id}
                className="bg-card border border-border rounded-lg p-6 flex flex-col lg:flex-row lg:items-center justify-between gap-6 hover:border-primary/30 transition-all shadow-sm group"
              >
                {/* Info Section */}
                <div className="flex-1 space-y-4">
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
                    <h3 className="font-serif text-lg font-medium">
                      Booking #{booking.id.slice(0, 8)}
                    </h3>
                    <div className="flex flex-col gap-1 mt-1">
                      <div className="flex items-center gap-4 text-sm text-muted-foreground">
                        <span className="flex items-center gap-1">
                          <Calendar className="w-3 h-3" />
                          {formatDate(booking.checkIn)} -{' '}
                          {formatDate(booking.checkOut)}
                        </span>
                        <span className="flex items-center gap-1">
                          Room:{' '}
                          {booking.room?.name || booking.roomId.slice(0, 8)}
                        </span>
                      </div>
                      <div className="text-sm">
                        <span className="font-medium text-foreground">
                          {booking.guestName || booking.user?.name || 'Guest'}
                        </span>
                        <span className="text-muted-foreground ml-2">
                          ({booking.guestEmail || booking.user?.email})
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Price Section */}
                <div className="text-right lg:text-right flex flex-col lg:items-end gap-1">
                  <p className="text-2xl font-serif font-medium">
                    ${booking.totalPrice}
                  </p>
                  <p className="text-xs text-muted-foreground uppercase tracking-wider font-bold">
                    Total
                  </p>
                </div>

                {/* Actions Section */}
                {/* Only show actions for relevant statuses */}
                <div className="flex flex-col gap-2 lg:border-l lg:border-border lg:pl-6 min-w-[140px]">
                  {/* Booking Status Actions */}
                  <div className="flex flex-wrap items-center gap-2 justify-end">
                    {booking.status === 'PENDING' && (
                      <>
                        <Button
                          size="sm"
                          className="bg-green-600 hover:bg-green-700 text-white"
                          disabled={isUpdatingStatus}
                          onClick={() =>
                            updateStatus({
                              id: booking.id,
                              status: 'CONFIRMED',
                            })
                          }
                        >
                          <CheckCircle2 className="w-4 h-4 mr-2" />
                          Confirm
                        </Button>
                        <Button
                          size="sm"
                          variant="destructive"
                          disabled={isUpdatingStatus}
                          onClick={() =>
                            updateStatus({
                              id: booking.id,
                              status: 'CANCELLED',
                            })
                          }
                        >
                          <XCircle className="w-4 h-4 mr-2" />
                          Decline
                        </Button>
                      </>
                    )}
                    {booking.status === 'CONFIRMED' && (
                      <Button
                        size="sm"
                        variant="outline"
                        disabled={isUpdatingStatus}
                        onClick={() =>
                          updateStatus({
                            id: booking.id,
                            status: 'COMPLETED',
                          })
                        }
                      >
                        <CheckCircle2 className="w-4 h-4 mr-2" />
                        Complete
                      </Button>
                    )}
                    {booking.status === 'CANCELLED' && (
                      <span className="text-xs text-muted-foreground italic">
                        Cancelled
                      </span>
                    )}
                    {booking.status === 'COMPLETED' && (
                      <span className="text-xs text-green-600 font-bold flex items-center gap-1">
                        <CheckCircle2 className="w-3 h-3" /> Completed
                      </span>
                    )}
                  </div>

                  {/* Payment Status Actions */}
                  {booking.status !== 'CANCELLED' && (
                    <div className="flex flex-wrap items-center gap-2 justify-end pt-2 border-t border-border/50">
                      {booking.paymentStatus === 'PENDING' && (
                        <Button
                          size="xs"
                          variant="ghost"
                          className="h-7 text-xs"
                          disabled={isUpdatingPayment}
                          onClick={() =>
                            updatePayment({
                              id: booking.id,
                              status: 'PAID',
                            })
                          }
                        >
                          Mark Paid
                        </Button>
                      )}
                      {booking.paymentStatus === 'PAID' && (
                        <Button
                          size="xs"
                          variant="ghost"
                          className="h-7 text-xs text-destructive hover:text-destructive"
                          disabled={isUpdatingPayment}
                          onClick={() =>
                            updatePayment({
                              id: booking.id,
                              status: 'REFUNDED',
                            })
                          }
                        >
                          Refund
                        </Button>
                      )}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
