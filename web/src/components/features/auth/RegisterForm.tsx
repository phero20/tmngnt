'use client';

import { useRegisterForm } from '@/hooks/useAuthForm';
import { Button } from '@/components/ui/button';
import { Form } from '@/components/ui/form';
import { Loader2 } from 'lucide-react';
import { AuthInput } from '@/components/common/AuthInput';
import { AuthHeader } from '@/components/common/AuthHeader';
import { AuthFooter } from '@/components/common/AuthFooter';

export default function RegisterForm() {
  const { form, onSubmit, isLoading, error } = useRegisterForm();

  return (
    <div className="w-full max-w-sm">
      <AuthHeader
        title="Create Account"
        subtitle="Sign up to access exclusive benefits"
      />

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <AuthInput
            control={form.control}
            name="name"
            label="Full Name"
            placeholder="John Doe"
          />

          <AuthInput
            control={form.control}
            name="email"
            label="Email"
            placeholder="name@example.com"
          />

          <AuthInput
            control={form.control}
            name="password"
            label="Password"
            type="password"
            placeholder="••••••••"
          />

          <AuthInput
            control={form.control}
            name="confirmPassword"
            label="Confirm Password"
            type="password"
            placeholder="••••••••"
          />

          {error && (
            <div className="text-destructive text-sm font-medium text-center bg-destructive/10 p-2 rounded-none">
              {error}
            </div>
          )}

          <Button
            type="submit"
            className="w-full h-10 font-bold tracking-wide rounded-none mt-2"
            disabled={isLoading}
          >
            {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {isLoading ? 'Creating Account...' : 'Sign Up'}
          </Button>
        </form>
      </Form>

      <AuthFooter
        label="Already have an account?"
        linkText="Sign In"
        href="/login"
      />
    </div>
  );
}
