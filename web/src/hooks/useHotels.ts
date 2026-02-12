'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { HotelService } from '@/services/hotel.service';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';
import type { Hotel } from '@/types/hotel.types';
import type {
  CreateHotelInput,
  UpdateHotelInput,
  UpdateRoomInput,
} from '@/lib/schemas/hotel.schema';

/**
 * Hook to fetch a list of hotels with optional filtering
 */
export function useHotels(params?: {
  city?: string;
  search?: string;
  page?: number;
  limit?: number;
  archived?: boolean;
}) {
  return useQuery({
    queryKey: ['hotels', params],
    queryFn: async () => {
      const response = await HotelService.listHotels(params);
      return response.data as Hotel[];
    },
  });
}

/**
 * Hook to fetch a single hotel by its ID
 */
export function useHotel(id: string) {
  return useQuery({
    queryKey: ['hotel', id],
    queryFn: async () => {
      const response = await HotelService.getHotel(id);
      return response.data as Hotel;
    },
    enabled: !!id,
  });
}

/**
 * Hook to create a new hotel property
 */
export function useCreateHotel() {
  const queryClient = useQueryClient();
  const router = useRouter();

  return useMutation({
    mutationFn: (data: CreateHotelInput) => HotelService.createHotel(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['hotels'] });
      toast.success('Property created successfully.');
      router.push('/dashboard/host/properties');
    },
    onError: (error: any) => {
      const msg = error.response?.data?.message || 'Failed to create property';
      toast.error(msg);
    },
  });
}

/**
 * Hook to update an existing hotel property
 */
export function useUpdateHotel(id: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: UpdateHotelInput) => HotelService.updateHotel(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['hotels'] });
      queryClient.invalidateQueries({ queryKey: ['hotel', id] });
      toast.success('Property updated successfully.');
    },
    onError: (error: any) => {
      const msg = error.response?.data?.message || 'Failed to update property';
      toast.error(msg);
    },
  });
}

/**
 * Hook to delete (soft-delete) a hotel property
 */
export function useDeleteHotel() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => HotelService.deleteHotel(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['hotels'] });
      toast.success('Property moved to archive.');
    },
    onError: (error: any) => {
      const msg = error.response?.data?.message || 'Failed to delete property';
      toast.error(msg);
    },
  });
}

/**
 * Hook to restore an archived hotel property
 */
export function useRestoreHotel() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => HotelService.restoreHotel(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['hotels'] });
      toast.success('Property restored successfully.');
    },
    onError: (error: any) => {
      const msg = error.response?.data?.message || 'Failed to restore property';
      toast.error(msg);
    },
  });
}

/**
 * Hook to fetch all available amenities
 */
export function useAmenities() {
  return useQuery({
    queryKey: ['amenities'],
    queryFn: async () => {
      const response = await HotelService.listAmenities();
      return response.data as {
        id: string;
        name: string;
        icon: string;
        category: string;
      }[];
    },
  });
}

/**
 * Hook to create a new amenity
 */
export function useCreateAmenity() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: { name: string; icon?: string; category?: string }) =>
      HotelService.createAmenity(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['amenities'] });
      toast.success('New amenity added to the catalog.');
    },
    onError: (error: any) => {
      const msg = error.response?.data?.message || 'Failed to add amenity';
      toast.error(msg);
    },
  });
}

/**
 * Hook to create a new room for a hotel
 */
export function useCreateRoom(hotelId: string) {
  const queryClient = useQueryClient();
  const router = useRouter();

  return useMutation({
    mutationFn: (data: any) => HotelService.createRoom(hotelId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['hotel', hotelId] });
      toast.success('Room created successfully.');
      router.push(`/dashboard/host/properties/${hotelId}`);
    },
    onError: (error: any) => {
      const msg = error.response?.data?.message || 'Failed to create room';
      toast.error(msg);
    },
  });
}

/**
 * Hook to update an existing room
 */
export function useUpdateRoom(hotelId: string, roomId: string) {
  const queryClient = useQueryClient();
  const router = useRouter();

  return useMutation({
    mutationFn: (data: UpdateRoomInput) =>
      HotelService.updateRoom(hotelId, roomId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['hotel', hotelId] });
      toast.success('Room updated successfully.');
      router.push(`/dashboard/host/properties/${hotelId}`);
    },
    onError: (error: any) => {
      const msg =
        error.response?.data?.message || 'Failed to update room details.';
      toast.error(msg);
    },
  });
}

/**
 * Hook to delete a room
 */
export function useDeleteRoom(hotelId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (roomId: string) => HotelService.deleteRoom(hotelId, roomId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['hotel', hotelId] });
      toast.success('Room deleted successfully.');
    },
    onError: (error: any) => {
      const msg = error.response?.data?.message || 'Failed to delete room.';
      toast.error(msg);
    },
  });
}
/**
 * Hook to reactivate (restore) an archived room
 */
export function useReactivateRoom(hotelId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (roomId: string) =>
      HotelService.updateRoom(hotelId, roomId, { isActive: true }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['hotel', hotelId] });
      toast.success('Room reactivated successfully.');
    },
    onError: (error: any) => {
      const msg = error.response?.data?.message || 'Failed to reactivate room.';
      toast.error(msg);
    },
  });
}
