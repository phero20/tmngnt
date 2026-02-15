import { OpenAPIHono } from '@hono/zod-openapi';
import { BookingRepository } from '../../repositories/booking.repository';
import { RoomRepository } from '../../repositories/room.repository';
import { HotelRepository } from '../../repositories/hotel.repository';
import { BookingService } from '../../services/booking.service';
import { BookingController } from '../../controllers/booking.controller';
import { AppBindings } from '../../types/hono.types';
import {
  registerPublicBookingRoutes,
  registerProtectedBookingRoutes,
} from './booking.routes';
import { authMiddleware } from '../../middleware/auth.middleware';

// Dependency Injection - Instantiate dependencies
// ... (repositories and service instantiation)
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
// ROUTES REGISTRATION
// ============================================================================

// 1. Register Public Routes (No Auth)
registerPublicBookingRoutes(bookingRoutes, bookingController);

// 2. Global Auth Middleware (For all subsequent routes)
bookingRoutes.use('/*', authMiddleware);

// 3. Register Protected Routes (Auth Required)
registerProtectedBookingRoutes(bookingRoutes, bookingController);

export default bookingRoutes;
