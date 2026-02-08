import { AuthRepository } from '../repositories/auth.repository';

export class AuthService {
  private authRepository: AuthRepository;

  constructor(authRepository: AuthRepository) {
    this.authRepository = authRepository;
  }

  async updateProfile(userId: string, data: { name?: string; image?: string }) {
    const updateData: Record<string, string> = {};
    if (data.name !== undefined) updateData.name = data.name;
    if (data.image !== undefined) updateData.image = data.image;

    if (Object.keys(updateData).length === 0) {
      return null;
    }

    return await this.authRepository.updateUser(userId, updateData);
  }

  async deleteUser(userId: string) {
    return await this.authRepository.deleteUser(userId);
  }
}
