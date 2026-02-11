'use client';

import { Info, MapPin, Zap, Check } from 'lucide-react';
import { cn } from '@/lib/utils';

interface StepIndicatorProps {
  currentStep: number;
}

export const StepIndicator = ({ currentStep }: StepIndicatorProps) => {
  const steps = [
    { id: 1, label: 'Basics', icon: Info },
    { id: 2, label: 'Location', icon: MapPin },
    { id: 3, label: 'Protocols', icon: Zap },
    { id: 4, label: 'Review', icon: Check },
  ];

  return (
    <div className="flex items-center justify-between max-w-2xl mx-auto mb-12">
      {steps.map((step, idx) => (
        <div key={step.id} className="flex items-center flex-1 last:flex-none">
          <div className="flex flex-col items-center group">
            <div
              className={cn(
                'w-10 h-10 rounded-full flex items-center justify-center border-2 transition-all duration-500',
                currentStep >= step.id
                  ? 'bg-primary border-primary text-white shadow-[0_0_15px_hsl(var(--primary)/0.4)]'
                  : 'bg-background border-border text-muted-foreground'
              )}
            >
              <step.icon className="w-5 h-5" />
            </div>
            <span
              className={cn(
                'text-[10px] uppercase tracking-widest font-bold mt-2',
                currentStep >= step.id
                  ? 'text-primary'
                  : 'text-muted-foreground'
              )}
            >
              {step.label}
            </span>
          </div>
          {idx !== steps.length - 1 && (
            <div
              className={cn(
                'h-[2px] w-full mx-4 transition-all duration-700',
                currentStep > step.id ? 'bg-primary' : 'bg-border'
              )}
            />
          )}
        </div>
      ))}
    </div>
  );
};
