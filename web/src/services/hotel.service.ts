import apiClient from '@/lib/axios';
import {
  CreateHotelInput,
  UpdateHotelInput,
  CreateRoomInput,
  UpdateRoomInput,
} from '@/lib/schemas/hotel.schema';

/**
 * HotelService (Frontend)
 * Handles all communication with the /api/hotels and /api/rooms endpoints.
 * Powered by our global Axios interceptor for error handling.
 */
export const HotelService = {
  // --- HOTEL OPERATIONS ---

  /**
   * Fetch all hotels (filtered by query)
   */
  listHotels: async (params?: {
    city?: string;
    search?: string;
    page?: number;
    limit?: number;
    archived?: boolean;
  }) => {
    return apiClient.get('/api/hotels', { params });
  },

  /**
   * Get a single hotel by ID or Slug
   */
  getHotel: async (id: string) => {
    return apiClient.get(`/api/hotels/${id}`);
  },

  /**
   * Create a new hotel property
   */
  createHotel: async (data: CreateHotelInput) => {
    return apiClient.post('/api/hotels', data);
  },

  /**
   * Update an existing hotel
   */
  updateHotel: async (id: string, data: UpdateHotelInput) => {
    return apiClient.patch(`/api/hotels/${id}`, data);
  },

  /**
   * Soft-delete a hotel
   */
  deleteHotel: async (id: string) => {
    return apiClient.delete(`/api/hotels/${id}`);
  },

  /**
   * Restore a soft-deleted hotel
   */
  restoreHotel: async (id: string) => {
    return apiClient.post(`/api/hotels/${id}/restore`);
  },

  // --- ROOM OPERATIONS ---

  /**
   * List all rooms for a specific hotel
   */
  listRooms: async (hotelId: string) => {
    return apiClient.get(`/api/hotels/${hotelId}/rooms`);
  },

  /**
   * Create a new room type for a hotel
   */
  createRoom: async (hotelId: string, data: CreateRoomInput) => {
    return apiClient.post(`/api/hotels/${hotelId}/rooms`, data);
  },

  /**
   * Update an existing room
   */
  updateRoom: async (
    hotelId: string,
    roomId: string,
    data: UpdateRoomInput
  ) => {
    return apiClient.patch(`/api/hotels/${hotelId}/rooms/${roomId}`, data);
  },

  /**
   * Delete a room
   */
  deleteRoom: async (hotelId: string, roomId: string) => {
    return apiClient.delete(`/api/hotels/${hotelId}/rooms/${roomId}`);
  },

  // --- AMENITY OPERATIONS ---

  /**
   * Fetch all available amenities
   */
  listAmenities: async () => {
    return apiClient.get('/api/amenities');
  },

  /**
   * Create a new amenity
   */
  createAmenity: async (data: {
    name: string;
    icon?: string;
    category?: string;
  }) => {
    return apiClient.post('/api/amenities', data);
  },
};
