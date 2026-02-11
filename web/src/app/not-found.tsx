import Link from 'next/link';
import { Button } from '@/components/ui/button';

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-background text-foreground text-center p-4">
      <h1 className="font-serif text-9xl font-bold tracking-tighter text-muted-foreground/20 select-none">
        404
      </h1>
      <div className="space-y-4 -mt-12 relative z-10">
        <h2 className="text-3xl font-serif font-medium tracking-tight">
          Page Not Found
        </h2>
        <p className="text-muted-foreground text-sm max-w-[400px] mx-auto font-sans">
          The page you are looking for might have been removed, had its name
          changed, or is temporarily unavailable.
        </p>
        <div className="pt-4">
          <Button
            asChild
            variant="default"
            className="rounded-none h-10 px-8 font-bold tracking-wide"
          >
            <Link href="/">Return Home</Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
