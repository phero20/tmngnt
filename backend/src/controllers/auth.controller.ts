import { Context } from 'hono';
import { auth } from '../lib/auth';
import { ok } from '../utils/response/api-response';
import { AppBindings } from '../types/hono.types';

export class AuthController {
  public handleAuth = (c: Context) => {
    return auth.handler(c.req.raw);
  };

  public getMe = (c: Context<AppBindings>) => {
    const user = c.get('user');
    return ok(c, user, 'User profile retrieved successfully');
  };
}
