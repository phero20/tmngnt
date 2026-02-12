'use client';

import { useLoginForm } from '@/hooks/useAuthForm';
import { Button } from '@/components/ui/button';
import { Form } from '@/components/ui/form';
import { Loader2 } from 'lucide-react';
import { AuthInput } from '@/components/common/AuthInput';
import { AuthHeader } from '@/components/common/AuthHeader';
import { AuthFooter } from '@/components/common/AuthFooter';

export default function LoginForm() {
  const { form, onSubmit, isLoading, error } = useLoginForm();

  return (
    <div className="w-full max-w-sm">
      <AuthHeader title="Welcome Back" subtitle="Sign in to your account" />

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
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
            {isLoading ? 'Signing In...' : 'Sign In'}
          </Button>
        </form>
      </Form>

      <AuthFooter
        label="Don't have an account?"
        linkText="Create an account"
        href="/register"
      />
    </div>
  );
}
