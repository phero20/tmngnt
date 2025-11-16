import { auth } from '../lib/auth';

export type Session = typeof auth.$Infer.Session.session;
export type User = typeof auth.$Infer.Session.user;

export interface AppBindings {
  Variables: {
    user: User | null;
    session: Session | null;
  };
}
