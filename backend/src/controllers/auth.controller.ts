import { Context } from 'hono';
import { auth } from '../lib/auth';
import { ok } from '../utils/response/api-response';
import { AppBindings } from '../types/hono.types';
import { AuthService } from '../services/auth.service';
import { NotFoundError } from '../utils/errors/http-error';

export class AuthController {
  private authService: AuthService;

  constructor(authService: AuthService) {
    this.authService = authService;
  }

  public handleAuth = (c: Context) => {
    // console.log(`[Auth] Handling: ${c.req.method} ${c.req.url}`);
    return auth.handler(c.req.raw);
  };

  public getMe = (c: Context<AppBindings>) => {
    const user = c.get('user');
    return ok(c, user, 'User profile retrieved successfully');
  };

  public updateMe = async (c: Context<AppBindings>) => {
    const user = c.get('user');
    const body = await c.req.json();

    if (!user) {
      throw new NotFoundError('User not found');
    }

    const { name, image } = body;
    const updatedUser = await this.authService.updateProfile(user.id, {
      name,
      image,
    });
    if (!updatedUser) {
      return ok(c, user, 'No changes provided');
    }
    return ok(c, updatedUser, 'Profile updated successfully');
  };

  public deleteMe = async (c: Context<AppBindings>) => {
    const user = c.get('user');
    if (!user) {
      throw new NotFoundError('User not found');
    }
    await this.authService.deleteUser(user.id);
    return ok(c, user, 'User deleted successfully');
  };
}
