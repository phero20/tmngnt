import { OpenAPIHono } from '@hono/zod-openapi';
import { AppBindings } from '../../types/hono.types';
import { AmenityController } from '../../controllers/amenity.controller';
import { AmenityService } from '../../services/amenity.service';
import { AmenityRepository } from '../../repositories/amenity.repository';
import {
  listAmenitiesRoute,
  createAmenityRoute,
  updateAmenityRoute,
  deleteAmenityRoute,
} from '../../contracts/amenity.contract';
import { authMiddleware } from '../../middleware/auth.middleware';

const amenityRoutes = new OpenAPIHono<AppBindings>();
const amenityRepository = new AmenityRepository();
const amenityService = new AmenityService(amenityRepository);
const amenityController = new AmenityController(amenityService);

// ============================================================================
// PUBLIC ROUTES
// ============================================================================

// List Amenities
amenityRoutes.openapi(
  listAmenitiesRoute,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  (c) => amenityController.listAmenities(c) as any
);

// ============================================================================
// PROTECTED ROUTES (Admin Only)
// ============================================================================

amenityRoutes.use('/*', authMiddleware);

// Create Amenity
amenityRoutes.openapi(
  createAmenityRoute,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  (c) => amenityController.createAmenity(c) as any
);

// Update Amenity
amenityRoutes.openapi(
  updateAmenityRoute,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  (c) => amenityController.updateAmenity(c) as any
);

// Delete Amenity
amenityRoutes.openapi(
  deleteAmenityRoute,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  (c) => amenityController.deleteAmenity(c) as any
);

export default amenityRoutes;
