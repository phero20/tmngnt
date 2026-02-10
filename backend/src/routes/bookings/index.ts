import { OpenAPIHono } from '@hono/zod-openapi';
import { BookingRepository } from '../../repositories/booking.repository';
import { RoomRepository } from '../../repositories/room.repository';
import { HotelRepository } from '../../repositories/hotel.repository';
import { BookingService } from '../../services/booking.service';
import { BookingController } from '../../controllers/booking.controller';
import { AppBindings } from '../../types/hono.types';
import { registerBookingRoutes } from './booking.routes';
import { authMiddleware } from '../../middleware/auth.middleware';

// Dependency Injection - Instantiate dependencies
const bookingRepository = new BookingRepository();
const roomRepository = new RoomRepository();
const hotelRepository = new HotelRepository();

const bookingService = new BookingService(
  bookingRepository,
  roomRepository,
  hotelRepository
);

const bookingController = new BookingController(bookingService);

// Create router
const bookingRoutes = new OpenAPIHono<AppBindings>();

// ============================================================================
// GLOBAL MIDDLEWARE FOR BOOKING MODULE
// ============================================================================
// Force Authentication for ALL Booking routes
bookingRoutes.use('/*', authMiddleware);

// Register routes
registerBookingRoutes(bookingRoutes, bookingController);

export default bookingRoutes;
