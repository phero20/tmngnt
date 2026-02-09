import { OpenAPIHono } from '@hono/zod-openapi';
import { HotelController } from '../../controllers/hotel.controller';
import { AppBindings } from '../../types/hono.types';
import {
  listRoomsRoute,
  getRoomRoute,
  createRoomRoute,
  updateRoomRoute,
  deleteRoomRoute,
} from '../../contracts/room.contract';

/**
 * Register all room-related routes
 */
export function registerRoomRoutes(
  router: OpenAPIHono<AppBindings>,
  controller: HotelController
) {
  // ============================================================================
  // PUBLIC ROUTES
  // ============================================================================

  // List Rooms for Hotel
  router.openapi(
    listRoomsRoute,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (c) => controller.listRooms(c) as any
  );

  // Get Room Details
  router.openapi(
    getRoomRoute,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (c) => controller.getRoom(c) as any
  );

  // ============================================================================
  // PROTECTED ROUTES (Require Authentication & Ownership)
  // ============================================================================

  // Create Room for Hotel
  router.openapi(
    createRoomRoute,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (c) => controller.createRoom(c) as any
  );

  // Update Room
  router.openapi(
    updateRoomRoute,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (c) => controller.updateRoom(c) as any
  );

  // Delete Room
  router.openapi(
    deleteRoomRoute,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (c) => controller.deleteRoom(c) as any
  );
}
