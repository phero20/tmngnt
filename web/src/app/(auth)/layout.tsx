import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import Image from 'next/image';
import { ASSETS } from '@/constants/assets';

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen bg-background text-foreground">
      {/* LEFT: Cinematic Visual (Hidden on mobile) */}
      <div className="hidden lg:flex w-1/2 relative bg-card border-r border-border">
        {/* Next.js Optimized Image */}
        <div className="absolute inset-0 grayscale opacity-10 select-none pointer-events-none">
          <Image
            src={ASSETS.AUTH_BACKGROUND}
            alt="Luxury Hotel"
            fill
            className="object-cover object-center mix-blend-multiply"
            priority
            quality={65}
          />
        </div>

        {/* Semantic Gradient */}
        <div className="absolute inset-0 bg-linear-to-t from-background via-background/10 to-transparent z-10" />

        <div className="relative z-20 p-16 flex flex-col justify-end w-full h-full">
          <div className="space-y-8 max-w-xl">
            <blockquote className="font-serif text-5xl font-medium leading-tight text-foreground tracking-tight selection:bg-primary/20">
              "True luxury is being able to disappear."
            </blockquote>
            <div className="h-px w-12 bg-primary/50" />
            <p className="text-muted-foreground text-xs uppercase tracking-[0.2em] font-medium selection:bg-primary/20">
              LuxeStay Collection © 2024
            </p>
          </div>
        </div>
      </div>

      {/* RIGHT: Form Area */}
      <div className="flex-1 flex flex-col justify-center items-center p-8 md:p-16 bg-card/70 relative selection:bg-primary selection:text-white">
        <div className="w-full max-w-[380px] space-y-8 animate-fade-in-up z-10">
          {children}
        </div>
      </div>
    </div>
  );
}
