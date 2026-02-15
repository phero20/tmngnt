import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { BookingService } from '@/services/booking.service';
import type {
  UpdateBookingStatusInput,
  UpdatePaymentStatusInput,
  CreateBookingInput,
  Booking,
} from '@/lib/schemas/booking.schema';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';

/**
 * Hook to fetch bookings for a hotel (Host/Owner view)
 */
export function useHotelBookings() {
  return useQuery({
    queryKey: ['hotel-bookings'],
    queryFn: async () => {
      const response = await BookingService.listHotelBookings();
      // Returns array of bookings
      return response.data as Booking[];
    },
  });
}

/**
 * Hook to fetch my bookings (Guest view)
 */
export function useMyBookings() {
  return useQuery({
    queryKey: ['my-bookings'],
    queryFn: async () => {
      const response = await BookingService.listMyBookings();
      return response.data as Booking[];
    },
  });
}

/**
 * Hook to create a new booking
 */
export function useCreateBooking() {
  const queryClient = useQueryClient();
  const router = useRouter();

  return useMutation({
    mutationFn: (data: CreateBookingInput) =>
      BookingService.createBooking(data),
    onSuccess: () => {
      toast.success('Booking request submitted successfully!');
      queryClient.invalidateQueries({ queryKey: ['my-bookings'] });
      // Redirect to guest dashboard to see the new booking
      router.push('/dashboard/guest/bookings');
    },
    onError: (error: any) => {
      toast.error(
        error.response?.data?.message || 'Failed to create booking request'
      );
    },
  });
}

/**
 * Hook to cancel a booking (Guest)
 */
export function useCancelBooking() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => BookingService.cancelBooking(id),
    onSuccess: () => {
      toast.success('Booking cancelled successfully');
      queryClient.invalidateQueries({ queryKey: ['my-bookings'] });
      queryClient.invalidateQueries({ queryKey: ['hotel-bookings'] });
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Failed to cancel booking');
    },
  });
}

/**
 * Hook to update booking status
 */
export function useUpdateBookingStatus() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      id,
      status,
    }: {
      id: string;
      status: UpdateBookingStatusInput['status'];
    }) => {
      return BookingService.updateBookingStatus(id, { status });
    },
    onSuccess: () => {
      toast.success('Booking status updated');
      queryClient.invalidateQueries({ queryKey: ['hotel-bookings'] });
      queryClient.invalidateQueries({ queryKey: ['my-bookings'] });
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Failed to update status');
    },
  });
}

/**
 * Hook to update payment status
 */
export function useUpdatePaymentStatus() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      id,
      status,
    }: {
      id: string;
      status: UpdatePaymentStatusInput['paymentStatus'];
    }) => {
      return BookingService.updatePaymentStatus(id, { paymentStatus: status });
    },
    onSuccess: () => {
      toast.success('Payment status updated');
      queryClient.invalidateQueries({ queryKey: ['hotel-bookings'] });
      queryClient.invalidateQueries({ queryKey: ['my-bookings'] });
    },
    onError: (error: any) => {
      toast.error(
        error.response?.data?.message || 'Failed to update payment status'
      );
    },
  });
}

/**
 * Hook to fetch room availability (booked dates)
 */
export function useRoomAvailability(roomId: string) {
  return useQuery({
    queryKey: ['room-availability', roomId],
    queryFn: () => BookingService.getRoomAvailability(roomId),
    enabled: !!roomId,
  });
}
