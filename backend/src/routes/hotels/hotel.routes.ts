import { OpenAPIHono } from '@hono/zod-openapi';
import { HotelController } from '../../controllers/hotel.controller';
import { AppBindings } from '../../types/hono.types';
import {
  listHotelsRoute,
  getHotelRoute,
  createHotelRoute,
  updateHotelRoute,
  deleteHotelRoute,
} from '../../contracts/hotel.contract';

/**
 * Register all hotel-related routes
 */
export function registerHotelRoutes(
  router: OpenAPIHono<AppBindings>,
  controller: HotelController
) {
  // ============================================================================
  // PUBLIC ROUTES
  // ============================================================================

  // List Hotels
  router.openapi(
    listHotelsRoute,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (c) => controller.listHotels(c) as any
  );

  // Get Hotel by ID
  router.openapi(
    getHotelRoute,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (c) => controller.getHotel(c) as any
  );

  // ============================================================================
  // PROTECTED ROUTES (Require Authentication)
  // ============================================================================

  // Create Hotel
  router.openapi(
    createHotelRoute,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (c) => controller.createHotel(c) as any
  );

  // Update Hotel (Owner Only)
  router.openapi(
    updateHotelRoute,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (c) => controller.updateHotel(c) as any
  );

  // Delete Hotel (Owner Only)
  router.openapi(
    deleteHotelRoute,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (c) => controller.deleteHotel(c) as any
  );
}
