import RegisterForm from '@/components/features/auth/RegisterForm';
import { constructMetadata } from '@/lib/seo';

export const metadata = constructMetadata({
  title: 'Join LuxeStay',
  description:
    'Create your LuxeStay account and begin your journey into a world of curated hospitality.',
});

export default function RegisterPage() {
  return (
    <div className="w-full flex items-center justify-center">
      <RegisterForm />
    </div>
  );
}
