'use client'; // Error boundaries must be Client Components

import { useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { AlertTriangle } from 'lucide-react';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-background text-foreground text-center p-4">
      <div className="flex flex-col items-center gap-4">
        <div className="bg-destructive/10 p-4 rounded-full">
          <AlertTriangle className="h-10 w-10 text-destructive" />
        </div>
        <h2 className="text-3xl font-serif font-medium tracking-tight mt-4">
          Something went wrong
        </h2>
        <p className="text-muted-foreground text-sm max-w-[400px] mx-auto font-sans leading-relaxed">
          An unexpected error occurred. Our team has been notified.
          <br />
          Please try again later.
        </p>
        <div className="pt-6">
          <Button
            onClick={reset}
            variant="default"
            className="rounded-none h-10 px-8 font-bold tracking-wide"
          >
            Try again
          </Button>
        </div>
      </div>
    </div>
  );
}
