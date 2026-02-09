import { AmenityRepository } from '../repositories/amenity.repository';
import { NotFoundError } from '../utils/errors/http-error';

export class AmenityService {
  constructor(private readonly amenityRepository: AmenityRepository) {}

  async createAmenity(data: {
    name: string;
    category?: string;
    icon?: string;
  }) {
    // Assuming admin check is done in middleware or controller
    return await this.amenityRepository.create(data);
  }

  async listAmenities() {
    return await this.amenityRepository.findAll();
  }

  async updateAmenity(
    id: string,
    data: Partial<{ name: string; category: string; icon: string }>
  ) {
    const existing = await this.amenityRepository.findById(id);
    if (!existing) {
      throw new NotFoundError('Amenity not found');
    }
    return await this.amenityRepository.update(id, data);
  }

  async deleteAmenity(id: string) {
    const existing = await this.amenityRepository.findById(id);
    if (!existing) {
      throw new NotFoundError('Amenity not found');
    }
    return await this.amenityRepository.delete(id);
  }
}
