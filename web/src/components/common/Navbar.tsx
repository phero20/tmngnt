'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { useState, useEffect } from 'react';
import { useSession } from '@/lib/auth-client';
import { useSignOut } from '@/hooks/useAuthForm';
import { LogOut, User as UserIcon, Loader2 } from 'lucide-react';
import type { User as AuthUser } from '@/types/auth.types';

// --- INDUSTRY STANDARD: COMPONENTIZE --- //

interface NavLinkProps {
  href: string;
  children: React.ReactNode;
}

const NavLink = ({ href, children }: NavLinkProps) => (
  <Link
    href={href}
    className="group relative text-xs font-bold uppercase tracking-[0.2em] text-white/60 transition-colors duration-300 hover:text-primary"
  >
    {children}
    <span className="absolute -bottom-2 left-0 h-[2px] w-0 bg-primary opacity-0 shadow-[0_0_10px_hsl(var(--primary))] transition-all duration-300 group-hover:w-full group-hover:opacity-100" />
  </Link>
);

const BrandLogo = () => (
  <Link href="/" className="group relative z-10 block">
    <span className="font-serif text-3xl font-bold tracking-wide text-white transition-colors duration-300 group-hover:text-primary">
      LuxeStay
      <span className="leading-none text-primary">.</span>
    </span>
  </Link>
);

const ReserveButton = () => (
  <Button
    className={cn(
      'rounded-none bg-primary px-10 py-6 text-xs font-black uppercase tracking-[0.25em] text-white transition-all duration-300',
      'hover:scale-105 hover:bg-primary/90 hover:shadow-[0_0_30px_hsl(var(--primary)/0.6)]',
      'shadow-[0_0_20px_hsl(var(--primary)/0.4)]'
    )}
  >
    Reserve
  </Button>
);

// --- MAIN COMPONENT --- //

export default function Navbar() {
  const { data: session, isPending } = useSession();
  const { handleSignOut, isLoggingOut } = useSignOut();
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navItems = [
    { name: 'Rooms', href: '/rooms' },
    { name: 'Philosophy', href: '/about' },
    { name: 'Journal', href: '/blog' },
    { name: 'Contact', href: '/contact' },
  ];

  return (
    <header
      className={cn(
        'fixed left-0 right-0 top-0 z-50 transition-all duration-300 ease-in-out border-b border-transparent',
        scrolled
          ? 'bg-black/95 py-4 shadow-2xl backdrop-blur-xl border-white/5'
          : 'bg-transparent py-8'
      )}
    >
      <div className="mx-auto flex max-w-[1600px] items-center justify-between px-6 md:px-12">
        <BrandLogo />

        {/* Desktop Navigation */}
        <nav className="absolute left-1/2 top-1/2 hidden -translate-x-1/2 -translate-y-1/2 items-center gap-14 md:flex">
          {navItems.map((item) => (
            <NavLink key={item.name} href={item.href}>
              {item.name}
            </NavLink>
          ))}
        </nav>

        {/* Actions Area */}
        <div className="z-10 flex items-center gap-6">
          {!isPending && (
            <>
              {session ? (
                <div className="flex items-center gap-6">
                  <Link
                    href={
                      (session.user as AuthUser).role === 'HOST' ||
                      (session.user as AuthUser).role === 'ADMIN'
                        ? '/dashboard/host'
                        : '/dashboard'
                    }
                    className="flex items-center gap-2 text-xs font-bold uppercase tracking-[0.2em] text-white/80 transition-colors hover:text-primary group"
                  >
                    <UserIcon className="w-3.5 h-3.5 group-hover:animate-pulse" />
                    <span className="hidden lg:inline">
                      {session.user.name.split(' ')[0]}
                    </span>
                  </Link>
                  <button
                    onClick={() => handleSignOut()}
                    disabled={isLoggingOut}
                    className="flex items-center gap-2 text-[10px] uppercase tracking-[0.2em] text-white/40 hover:text-destructive transition-colors group px-2 py-1 border border-white/10 hover:border-destructive/50 disabled:opacity-50"
                  >
                    {isLoggingOut ? (
                      <Loader2 className="w-3 h-3 animate-spin" />
                    ) : (
                      <LogOut className="w-3 h-3" />
                    )}
                    Logout
                  </button>
                </div>
              ) : (
                <Link
                  href="/login"
                  className="hidden text-xs font-bold uppercase tracking-[0.2em] text-white/80 transition-colors hover:text-primary sm:block"
                >
                  Sign In
                </Link>
              )}
            </>
          )}

          <ReserveButton />
        </div>
      </div>
    </header>
  );
}
