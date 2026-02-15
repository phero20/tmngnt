import { HotelRepository } from '../repositories/hotel.repository';
import { RoomRepository } from '../repositories/room.repository';
import {
  CreateHotelInput,
  UpdateHotelInput,
  CreateRoomInput,
  UpdateRoomInput,
} from '../schemas/hotel.schema';
import { NotFoundError, ForbiddenError } from '../utils/errors/http-error';

/**
 * Hotel Service
 * Contains all business logic for hotel and room operations
 * Throws HttpError exceptions that are handled by global error handler
 */
export class HotelService {
  private hotelRepository: HotelRepository;
  private roomRepository: RoomRepository;

  constructor(
    hotelRepository: HotelRepository,
    roomRepository: RoomRepository
  ) {
    this.hotelRepository = hotelRepository;
    this.roomRepository = roomRepository;
  }

  /**
   * Generate a unique slug from hotel name
   */
  private generateSlug(name: string): string {
    const slug = name
      .toLowerCase()
      .replace(/ /g, '-')
      .replace(/[^\w-]+/g, '');
    return `${slug}-${Date.now()}`;
  }

  /**
   * Create a new hotel
   */
  async createHotel(ownerId: string, data: CreateHotelInput) {
    const slug = this.generateSlug(data.name);

    const newHotel = await this.hotelRepository.create({
      ...data,
      ownerId,
      slug,
      amenityIds: data.amenities,
      images: data.images,
      latitude: data.latitude?.toString(),
      longitude: data.longitude?.toString(),
    });

    return newHotel;
  }

  /**
   * List hotels with optional filters
   */
  async listHotels(filters: {
    city?: string;
    search?: string;
    page?: number;
    limit?: number;
    ownerId?: string;
    archived?: boolean;
  }) {
    const limit = filters.limit || 10;
    const offset = ((filters.page || 1) - 1) * limit;

    const hotels = await this.hotelRepository.findAll({
      city: filters.city,
      search: filters.search,
      limit,
      offset,
      ownerId: filters.ownerId,
      archived: filters.archived,
    });

    return hotels;
  }

  /**
   * Get hotel by ID
   * @throws {NotFoundError} If hotel doesn't exist
   */
  async getHotelById(id: string) {
    const hotel = await this.hotelRepository.findById(id);

    if (!hotel) {
      throw new NotFoundError('Hotel not found');
    }

    return hotel;
  }

  /**
   * Update hotel with ownership verification
   * @throws {NotFoundError} If hotel doesn't exist
   * @throws {ForbiddenError} If user doesn't own the hotel
   */
  async updateHotel(id: string, ownerId: string, data: UpdateHotelInput) {
    // Verify hotel exists
    const existing = await this.hotelRepository.findById(id);
    if (!existing) {
      throw new NotFoundError('Hotel not found');
    }

    // Verify ownership
    if (existing.ownerId !== ownerId) {
      throw new ForbiddenError('You do not own this hotel');
    }

    // Prepare update payload
    const { latitude, longitude, ...restData } = data;
    const updatePayload = {
      ...restData,
      ...(latitude !== undefined ? { latitude: latitude.toString() } : {}),
      ...(longitude !== undefined ? { longitude: longitude.toString() } : {}),
    };

    const updated = await this.hotelRepository.update(id, updatePayload);
    return updated;
  }

  /**
   * Delete hotel (soft delete) with ownership verification
   * @throws {NotFoundError} If hotel doesn't exist
   * @throws {ForbiddenError} If user doesn't own the hotel
   */
  async deleteHotel(id: string, ownerId: string) {
    // Verify hotel exists
    const existing = await this.hotelRepository.findById(id);
    if (!existing) {
      throw new NotFoundError('Hotel not found');
    }

    // Verify ownership
    if (existing.ownerId !== ownerId) {
      throw new ForbiddenError('You do not own this hotel');
    }

    await this.hotelRepository.delete(id);
    return { success: true };
  }

  /**
   * Restore (un-archive) a hotel
   * @throws {NotFoundError} If hotel doesn't exist
   * @throws {ForbiddenError} If user doesn't own the hotel
   */
  async restoreHotel(id: string, ownerId: string) {
    // Verify hotel exists (even if archived)
    const existing = await this.hotelRepository.findById(id, true);
    if (!existing) {
      throw new NotFoundError('Hotel not found');
    }

    // Verify ownership
    if (existing.ownerId !== ownerId) {
      throw new ForbiddenError('You do not own this hotel');
    }

    await this.hotelRepository.restore(id);
    return { success: true };
  }

  /**
   * Create a room for a hotel with ownership verification
   * @throws {NotFoundError} If hotel doesn't exist
   * @throws {ForbiddenError} If user doesn't own the hotel
   */
  async createRoom(hotelId: string, ownerId: string, data: CreateRoomInput) {
    // Verify hotel exists
    const hotel = await this.hotelRepository.findById(hotelId);
    if (!hotel) {
      throw new NotFoundError('Hotel not found');
    }

    // Verify ownership
    if (hotel.ownerId !== ownerId) {
      throw new ForbiddenError('You do not own this hotel');
    }

    const newRoom = await this.roomRepository.create({
      ...data,
      hotelId,
      price: data.price.toString(),
      amenityIds: data.amenities,
      images: data.images,
    });

    return newRoom;
  }

  /**
   * List all rooms for a hotel
   */
  async listRoomsByHotelId(hotelId: string) {
    const rooms = await this.roomRepository.findAllByHotelId(hotelId);
    return rooms;
  }

  /**
   * Get room by ID
   * @throws {NotFoundError} If room doesn't exist
   */
  async getRoomById(id: string) {
    const room = await this.roomRepository.findById(id);

    if (!room) {
      throw new NotFoundError('Room not found');
    }

    return room;
  }

  /**
   * Update room with ownership verification
   * @throws {NotFoundError} If room or hotel doesn't exist
   * @throws {ForbiddenError} If user doesn't own the hotel
   */
  async updateRoom(roomId: string, ownerId: string, data: UpdateRoomInput) {
    // Verify room exists
    const existingRoom = await this.roomRepository.findById(roomId);
    if (!existingRoom) {
      throw new NotFoundError('Room not found');
    }

    // Verify hotel ownership
    const hotel = await this.hotelRepository.findById(existingRoom.hotelId);
    if (!hotel) {
      throw new NotFoundError('Hotel not found');
    }

    if (hotel.ownerId !== ownerId) {
      throw new ForbiddenError('You do not own this hotel');
    }

    // Prepare update payload
    const { price, ...restData } = data;
    const updatePayload = {
      ...restData,
      ...(price !== undefined ? { price: price.toString() } : {}),
    };

    const updated = await this.roomRepository.update(roomId, updatePayload);
    return updated;
  }

  /**
   * Delete room (soft delete) with ownership verification
   * @throws {NotFoundError} If room or hotel doesn't exist
   * @throws {ForbiddenError} If user doesn't own the hotel
   */
  async deleteRoom(roomId: string, ownerId: string) {
    // Verify room exists
    const existingRoom = await this.roomRepository.findById(roomId);
    if (!existingRoom) {
      throw new NotFoundError('Room not found');
    }

    // Verify hotel ownership
    const hotel = await this.hotelRepository.findById(existingRoom.hotelId);
    if (!hotel) {
      throw new NotFoundError('Hotel not found');
    }

    if (hotel.ownerId !== ownerId) {
      throw new ForbiddenError('You do not own this hotel');
    }

    await this.roomRepository.delete(roomId);
    return { success: true };
  }
}
