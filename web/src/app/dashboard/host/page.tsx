'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import {
  Hotel,
  Calendar,
  Users,
  CreditCard,
  ExternalLink,
  ChevronRight,
  TrendingUp,
  Clock,
  ShieldAlert,
  Loader2,
} from 'lucide-react';
import { useSession } from '@/lib/auth-client';
import type { User as AuthUser } from '@/types/auth.types';

export default function DashboardPage() {
  const { data: session, isPending } = useSession();
  const user = session?.user as AuthUser | undefined;

  const stats = [
    { label: 'Active Bookings', value: '12', icon: Calendar, trend: '+4%' },
    {
      label: 'Total Revenue',
      value: '$24,400',
      icon: CreditCard,
      trend: '+12%',
    },
    { label: 'Upcoming Arrivals', value: '8', icon: Users, trend: 'Normal' },
  ];

  const quickActions = [
    {
      name: 'Manage Properties',
      href: '/dashboard/host/properties',
      icon: Hotel,
      color: 'text-primary',
    },
    {
      name: 'Guest List',
      href: '/dashboard/host/guests',
      icon: Users,
      color: 'text-blue-500',
    },
    {
      name: 'Reservations',
      href: '/dashboard/host/bookings',
      icon: Clock,
      color: 'text-green-500',
    },
    {
      name: 'Financials',
      href: '/dashboard/host/finance',
      icon: CreditCard,
      color: 'text-purple-500',
    },
  ];

  if (isPending) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  // Double-security fallback check
  if (!user || (user.role !== 'HOST' && user.role !== 'ADMIN')) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background p-6">
        <div className="max-w-md w-full border border-destructive/20 bg-destructive/5 p-8 text-center space-y-6">
          <ShieldAlert className="w-12 h-12 text-destructive mx-auto" />
          <div className="space-y-2">
            <h2 className="font-serif text-2xl font-bold text-destructive">
              Access Restricted
            </h2>
            <p className="text-muted-foreground text-sm font-sans">
              You do not have the required permissions to access the Estate
              Management console. Please contact your administrator.
            </p>
          </div>
          <Button asChild className="w-full rounded-none">
            <Link href="/dashboard">Return to Dashboard</Link>
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background pt-24 pb-12 px-6 lg:px-12">
      <div className="max-w-7xl mx-auto space-y-12 animate-in fade-in slide-in-from-bottom-4 duration-700">
        {/* --- WELCOME HEADER --- */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-border pb-10">
          <div className="space-y-2">
            <p className="text-primary font-bold uppercase tracking-[0.25em] text-[10px]">
              Command Center
            </p>
            <h1 className="font-serif text-4xl font-medium tracking-tight">
              Welcome back,{' '}
              <span className="text-foreground/80">
                {user.name.split(' ')[0]}
              </span>
            </h1>
            <p className="text-muted-foreground text-sm max-w-md font-sans leading-relaxed">
              Your properties are performing at{' '}
              <span className="text-foreground">92% occupancy</span>. Review
              your today's arrivals and operational metrics below.
            </p>
          </div>
          <div className="flex items-center gap-4">
            <Button
              variant="outline"
              className="rounded-none h-10 px-6 font-bold tracking-wide border-white/10 hover:bg-white/5"
            >
              Generate Report
            </Button>
            <Button className="rounded-none h-10 px-6 font-bold tracking-wide shadow-[0_0_20px_hsl(var(--primary)/0.2)]">
              New Booking
            </Button>
          </div>
        </div>

        {/* --- STATS GRID --- */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {stats.map((stat) => (
            <div
              key={stat.label}
              className="bg-card border border-border p-6 space-y-4 hover:border-primary/50 transition-colors group"
            >
              <div className="flex items-center justify-between">
                <div className="p-2 border border-white/5 bg-white/[0.02]">
                  <stat.icon className="w-5 h-5 text-primary" />
                </div>
                <span
                  className={cn(
                    'text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider',
                    stat.trend.startsWith('+')
                      ? 'bg-primary/10 text-primary'
                      : 'bg-white/5 text-muted-foreground'
                  )}
                >
                  {stat.trend}
                </span>
              </div>
              <div>
                <p className="text-muted-foreground text-[11px] uppercase tracking-widest font-bold">
                  {stat.label}
                </p>
                <h3 className="text-2xl font-serif mt-1">{stat.value}</h3>
              </div>
            </div>
          ))}
        </div>

        {/* --- QUICK ACTIONS & OVERVIEW --- */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Quick Actions Panel */}
          <div className="lg:col-span-1 space-y-6">
            <h3 className="font-serif text-xl font-medium px-1">
              Management Hub
            </h3>
            <div className="flex flex-col gap-2">
              {quickActions.map((action) => (
                <Link
                  key={action.name}
                  href={action.href}
                  className="group flex items-center justify-between p-4 border border-border bg-card/50 hover:bg-card transition-all"
                >
                  <div className="flex items-center gap-4">
                    <action.icon className={cn('w-5 h-5', action.color)} />
                    <span className="text-sm font-bold tracking-wide">
                      {action.name}
                    </span>
                  </div>
                  <ChevronRight className="w-4 h-4 text-muted-foreground group-hover:text-primary transition-colors" />
                </Link>
              ))}
            </div>
          </div>

          {/* Activity Placeholder */}
          <div className="lg:col-span-2 space-y-6">
            <div className="flex items-center justify-between px-1">
              <h3 className="font-serif text-xl font-medium inline-flex items-center gap-3">
                Live Overview
                <span className="flex h-2 w-2 rounded-full bg-primary animate-pulse" />
              </h3>
              <Link
                href="/dashboard/host/activity"
                className="text-primary text-[10px] font-black uppercase tracking-widest flex items-center gap-1 hover:underline"
              >
                Full Log <ExternalLink className="w-3 h-3" />
              </Link>
            </div>
            <div className="border border-border bg-card/30 aspect-video flex flex-col items-center justify-center text-center p-12 space-y-4">
              <TrendingUp className="w-12 h-12 text-muted-foreground/20" />
              <div className="space-y-1">
                <p className="font-bold text-sm tracking-wide">
                  Initializing Analytics...
                </p>
                <p className="text-muted-foreground text-xs font-sans max-w-xs mx-auto">
                  As guests interact with your properties, real-time occupancy
                  and revenue heatmaps will appear here.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function cn(...classes: any[]) {
  return classes.filter((b) => !!b).join(' ');
}
