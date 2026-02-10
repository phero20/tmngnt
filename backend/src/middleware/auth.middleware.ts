import { Context, Next } from 'hono';
import { auth } from '../lib/auth';
import { UnauthorizedError, ForbiddenError } from '../utils/errors/http-error';
import { AppBindings } from '../types/hono.types';

export const authMiddleware = async (c: Context<AppBindings>, next: Next) => {
  const session = await auth.api.getSession({ headers: c.req.header() });

  if (!session) {
    throw new UnauthorizedError(
      'You must be logged in to access this resource'
    );
  }

  if (session.user.banned) {
    throw new ForbiddenError('Your account has been banned.');
  }

  c.set('user', session.user);
  c.set('session', session.session);

  await next();
};
