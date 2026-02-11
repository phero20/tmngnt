import LoginForm from '@/components/features/auth/LoginForm';
import { constructMetadata } from '@/lib/seo';

export const metadata = constructMetadata({
  title: 'Sign In',
  description:
    'Access your LuxeStay account to manage your sanctuary and reservations.',
});

export default function LoginPage() {
  return (
    <div className="w-full flex items-center justify-center">
      <LoginForm />
    </div>
  );
}
