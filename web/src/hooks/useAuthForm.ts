'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  LoginSchema,
  RegisterSchema,
  LoginFormData,
  RegisterFormData,
} from '@/lib/schemas/auth.schema';
import { AuthService } from '@/services/auth.service';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { useMutation } from '@tanstack/react-query';
import { useState } from 'react';

/**
 * useLoginForm Hook
 */
export function useLoginForm() {
  const router = useRouter();
  const [localError, setLocalError] = useState<string | null>(null);

  const form = useForm<LoginFormData>({
    resolver: zodResolver(LoginSchema),
    defaultValues: { email: '', password: '' },
  });

  const mutation = useMutation({
    mutationFn: AuthService.login,
    onMutate: () => setLocalError(null),
    onSuccess: (result) => {
      if (result.error) {
        const msg = result.error.message || 'Invalid credentials';
        setLocalError(msg);
        toast.error(msg);
        return;
      }
      toast.success('Welcome back to LuxeStay.');
      router.push('/dashboard');
      router.refresh();
    },
    onError: (error: any) => {
      const msg = error.response?.data?.message || 'Connection failed';
      setLocalError(msg);
      toast.error(msg);
    },
  });

  return {
    form,
    onSubmit: (data: LoginFormData) => mutation.mutate(data),
    isLoading: mutation.isPending,
    error: localError,
  };
}

/**
 * useRegisterForm Hook
 */
export function useRegisterForm() {
  const router = useRouter();
  const [localError, setLocalError] = useState<string | null>(null);

  const form = useForm<RegisterFormData>({
    resolver: zodResolver(RegisterSchema),
    defaultValues: {
      name: '',
      email: '',
      password: '',
      confirmPassword: '',
    },
  });

  const mutation = useMutation({
    mutationFn: AuthService.register,
    onMutate: () => setLocalError(null),
    onSuccess: (result) => {
      if (result.error) {
        const msg = result.error.message || 'Registration failed';
        setLocalError(msg);
        toast.error(msg);
        return;
      }
      toast.success('Account created. Please sign in.');
      router.push('/login');
    },
    onError: (error: any) => {
      const msg = error.response?.data?.message || 'Registration failed';
      setLocalError(msg);
      toast.error(msg);
    },
  });

  return {
    form,
    onSubmit: (data: RegisterFormData) => mutation.mutate(data),
    isLoading: mutation.isPending,
    error: localError,
  };
}

/**
 * useSignOut Hook
 */
export function useSignOut() {
  const router = useRouter();

  const mutation = useMutation({
    mutationFn: AuthService.logout,
    onSuccess: () => {
      toast.success('Securely signed out.');
      router.push('/login');
      router.refresh();
    },
  });

  return {
    handleSignOut: mutation.mutate,
    isLoggingOut: mutation.isPending,
  };
}
