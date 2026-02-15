import apiClient from '@/lib/axios';
import {
  CreateBookingInput,
  UpdateBookingStatusInput,
  UpdatePaymentStatusInput,
} from '@/lib/schemas/booking.schema';

/**
 * BookingService (Frontend)
 * Handles all communication with the /api/bookings endpoints.
 */
export const BookingService = {
  /**
   * Create a new booking
   */
  createBooking: async (data: CreateBookingInput) => {
    return apiClient.post('/api/bookings', data);
  },

  /**
   * List my bookings (as Guest)
   */
  listMyBookings: async () => {
    return apiClient.get('/api/bookings/my');
  },

  /**
   * List bookings for my hotels (as Owner/Host)
   */
  listHotelBookings: async () => {
    return apiClient.get('/api/bookings/hotel');
  },

  /**
   * Cancel a booking (Guest)
   */
  cancelBooking: async (id: string) => {
    return apiClient.patch(`/api/bookings/${id}/cancel`);
  },

  /**
   * Update booking status (Host/Admin)
   */
  updateBookingStatus: async (id: string, data: UpdateBookingStatusInput) => {
    return apiClient.patch(`/api/bookings/${id}/status`, data);
  },

  /**
   * Update payment status (Host/Admin)
   */
  updatePaymentStatus: async (id: string, data: UpdatePaymentStatusInput) => {
    return apiClient.patch(`/api/bookings/${id}/payment-status`, data);
  },

  /**
   * Get room availability (Public)
   */
  getRoomAvailability: async (roomId: string) => {
    const response = await apiClient.get(
      `/api/bookings/${roomId}/availability`
    );
    return response.data.data; // Assuming OK response helper wraps it in { data }
  },
};
