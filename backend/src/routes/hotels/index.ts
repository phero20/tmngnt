import { OpenAPIHono } from '@hono/zod-openapi';
import { HotelRepository } from '../../repositories/hotel.repository';
import { RoomRepository } from '../../repositories/room.repository';
import { HotelService } from '../../services/hotel.service';
import { HotelController } from '../../controllers/hotel.controller';
import { AppBindings } from '../../types/hono.types';
import { registerHotelRoutes } from './hotel.routes';
import { registerRoomRoutes } from './room.routes';

// Dependency Injection - Instantiate dependencies
const hotelRepository = new HotelRepository();
const roomRepository = new RoomRepository();
const hotelService = new HotelService(hotelRepository, roomRepository);
const hotelController = new HotelController(hotelService);

import { authMiddleware } from '../../middleware/auth.middleware';

// Create router
const hotelRoutes = new OpenAPIHono<AppBindings>();

// ============================================================================
// GLOBAL MIDDLEWARE FOR HOTEL MODULE
// ============================================================================
// Force Authentication for ALL "Write" operations (POST, PATCH, DELETE)
// This applies to BOTH Hotel and Room routes
hotelRoutes.use('/*', async (c, next) => {
  if (c.req.method !== 'GET') {
    return authMiddleware(c, next);
  }
  await next();
});

// Register all routes
registerHotelRoutes(hotelRoutes, hotelController);
registerRoomRoutes(hotelRoutes, hotelController);

export default hotelRoutes;
