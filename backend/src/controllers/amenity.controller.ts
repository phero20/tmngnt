import { Context } from 'hono';
import { AmenityService } from '../services/amenity.service';
import { ok, created } from '../utils/response/api-response';
import {
  CreateAmenitySchema,
  UpdateAmenitySchema,
} from '../schemas/amenity.schema';
import { z } from 'zod';

export class AmenityController {
  constructor(private readonly amenityService: AmenityService) {}

  async createAmenity(c: Context) {
    const data = await c.req.json();
    const result = await this.amenityService.createAmenity(
      data as z.infer<typeof CreateAmenitySchema>
    );
    return created(c, result, 'Amenity created successfully');
  }

  async listAmenities(c: Context) {
    const result = await this.amenityService.listAmenities();
    return ok(c, result);
  }

  async updateAmenity(c: Context) {
    const id = c.req.param('id');
    const data = await c.req.json();
    const result = await this.amenityService.updateAmenity(
      id,
      data as z.infer<typeof UpdateAmenitySchema>
    );
    return ok(c, result, 'Amenity updated successfully');
  }

  async deleteAmenity(c: Context) {
    const id = c.req.param('id');
    await this.amenityService.deleteAmenity(id);
    return ok(c, null, 'Amenity deleted successfully');
  }
}
