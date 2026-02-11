import { redirect } from 'next/navigation';
import { headers } from 'next/headers';
import { envConfig } from '@/config/env.config';

/**
 * Root Dashboard Redirector
 * Detects user role and sends them to the correct experience.
 * This is the 'Master Guard' for the dashboard path.
 */
export default async function DashboardRedirectPage() {
  const cookieHeader = (await headers()).get('cookie') || '';

  try {
    // We verify the session server-side to prevent flickering
    const response = await fetch(
      `${envConfig.get('NEXT_PUBLIC_BACKEND_URL')}/api/auth/get-session`,
      {
        headers: { cookie: cookieHeader },
      }
    );

    if (!response.ok) {
      redirect('/login');
    }

    const session = await response.json();
    const role = session?.user?.role;

    if (role === 'HOST' || role === 'ADMIN') {
      redirect('/dashboard/host');
    } else {
      // Future: redirect('/dashboard/guest')
      redirect('/'); // For now, send back to home if not a host
    }
  } catch (error) {
    console.error('Dashboard Redirect Error:', error);
    redirect('/login');
  }

  return null;
}
