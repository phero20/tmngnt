import { Context } from 'hono';
import { HotelService } from '../services/hotel.service';
import {
  CreateHotelSchema,
  UpdateHotelSchema,
  CreateRoomSchema,
  UpdateRoomSchema,
} from '../schemas/hotel.schema';
import { ok, created } from '../utils/response/api-response';
import { UnauthorizedError, ForbiddenError } from '../utils/errors/http-error';
import { AppBindings } from '../types/hono.types';

/**
 * Hotel Controller
 * Handles HTTP request/response and delegates business logic to service layer
 * Uses standard response helpers and lets errors propagate to global error handler
 */
export class HotelController {
  private hotelService: HotelService;

  constructor(hotelService: HotelService) {
    this.hotelService = hotelService;
  }

  // --- Hotel Operations ---

  /**
   * Create a new hotel
   */
  public createHotel = async (c: Context<AppBindings>) => {
    const user = c.get('user');
    if (!user) {
      throw new UnauthorizedError();
    }

    // RBAC: Only HOST or ADMIN can create hotels
    if (user.role !== 'HOST' && user.role !== 'ADMIN') {
      throw new ForbiddenError('Only hosts can list hotels');
    }

    const body = await c.req.json();
    const validData = CreateHotelSchema.parse(body);

    const newHotel = await this.hotelService.createHotel(user.id, validData);
    return created(c, newHotel, 'Hotel created successfully');
  };

  /**
   * List all hotels with optional filters
   */
  public listHotels = async (c: Context) => {
    const query = c.req.query();

    const hotels = await this.hotelService.listHotels({
      city: query.city,
      search: query.search,
      page: query.page ? parseInt(query.page) : undefined,
      limit: query.limit ? parseInt(query.limit) : undefined,
    });

    return ok(c, hotels, 'Hotels retrieved successfully');
  };

  /**
   * Get hotel details by ID
   */
  public getHotel = async (c: Context) => {
    const id = c.req.param('id');
    const hotel = await this.hotelService.getHotelById(id);

    return ok(c, hotel, 'Hotel retrieved successfully');
  };

  /**
   * Update hotel details
   */
  public updateHotel = async (c: Context<AppBindings>) => {
    const id = c.req.param('id');
    const user = c.get('user');

    if (!user) {
      throw new UnauthorizedError();
    }

    const body = await c.req.json();
    const validData = UpdateHotelSchema.parse(body);

    const updated = await this.hotelService.updateHotel(id, user.id, validData);
    return ok(c, updated, 'Hotel updated successfully');
  };

  /**
   * Delete hotel (soft delete)
   */
  public deleteHotel = async (c: Context<AppBindings>) => {
    const id = c.req.param('id');
    const user = c.get('user');

    if (!user) {
      throw new UnauthorizedError();
    }

    const result = await this.hotelService.deleteHotel(id, user.id);
    return ok(c, result, 'Hotel deleted successfully');
  };

  // --- Room Operations ---

  /**
   * Create a new room for a hotel
   */
  public createRoom = async (c: Context<AppBindings>) => {
    const hotelId = c.req.param('id');
    const user = c.get('user');

    if (!user) {
      throw new UnauthorizedError();
    }

    const body = await c.req.json();
    const validData = CreateRoomSchema.parse(body);

    const newRoom = await this.hotelService.createRoom(
      hotelId,
      user.id,
      validData
    );
    return created(c, newRoom, 'Room created successfully');
  };

  /**
   * List all rooms for a hotel
   */
  public listRooms = async (c: Context) => {
    const hotelId = c.req.param('id');
    const rooms = await this.hotelService.listRoomsByHotelId(hotelId);
    return ok(c, rooms, 'Rooms retrieved successfully');
  };

  /**
   * Get room details by ID
   */
  public getRoom = async (c: Context) => {
    const roomId = c.req.param('roomId');
    const room = await this.hotelService.getRoomById(roomId);
    return ok(c, room, 'Room retrieved successfully');
  };

  /**
   * Update room details
   */
  public updateRoom = async (c: Context<AppBindings>) => {
    const roomId = c.req.param('roomId');
    const user = c.get('user');

    if (!user) {
      throw new UnauthorizedError();
    }

    const body = await c.req.json();
    const validData = UpdateRoomSchema.parse(body);

    const updated = await this.hotelService.updateRoom(
      roomId,
      user.id,
      validData
    );
    return ok(c, updated, 'Room updated successfully');
  };

  /**
   * Delete room (soft delete)
   */
  public deleteRoom = async (c: Context<AppBindings>) => {
    const roomId = c.req.param('roomId');
    const user = c.get('user');

    if (!user) {
      throw new UnauthorizedError();
    }

    const result = await this.hotelService.deleteRoom(roomId, user.id);
    return ok(c, result, 'Room deleted successfully');
  };
}
