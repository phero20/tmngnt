'use client';

import { usePropertyFormStore } from '@/store/usePropertyFormStore';
import { useCreateHotel } from '@/hooks/useHotels';
import { Button } from '@/components/ui/button';
import {
  ChevronLeft,
  ChevronRight,
  Check,
  ArrowLeft,
  Loader2,
} from 'lucide-react';
import Link from 'next/link';
import { useEffect } from 'react';

// --- COMPONENTS ---
import { StepIndicator } from './components/StepIndicator';
import { BasicsStep } from './components/BasicsStep';
import { LocationStep } from './components/LocationStep';
import { ProtocolsStep } from './components/ProtocolsStep';
import { ReviewStep } from './components/ReviewStep';

export default function NewPropertyPage() {
  const { formData, currentStep, nextStep, prevStep, resetForm } =
    usePropertyFormStore();

  const createHotelMutation = useCreateHotel();

  // Reset form on mount to ensure clean slate
  useEffect(() => {
    resetForm();
  }, [resetForm]);

  const handleSubmit = () => {
    createHotelMutation.mutate(formData);
  };

  const isStepValid = () => {
    if (currentStep === 1)
      return formData.name.length >= 3 && formData.contactEmail;
    if (currentStep === 2)
      return !!(formData.address && formData.city && formData.country);
    if (currentStep === 3)
      return !!(formData.checkInTime && formData.checkOutTime);
    return true;
  };

  return (
    <div className="min-h-screen bg-background pt-24 pb-20 px-6 lg:px-12">
      <div className="max-w-4xl mx-auto">
        {/* --- HEADER --- */}
        <div className="flex items-center gap-4 mb-10">
          <Button asChild variant="ghost" size="icon" className="rounded-full">
            <Link href="/dashboard/host/properties">
              <ArrowLeft className="w-5 h-5" />
            </Link>
          </Button>
          <div className="space-y-1">
            <h1 className="font-serif text-3xl font-medium tracking-tight">
              List Your Estate
            </h1>
            <p className="text-muted-foreground text-xs uppercase tracking-widest font-bold">
              Property Creation Wizard — Step {currentStep} of 4
            </p>
          </div>
        </div>

        <StepIndicator currentStep={currentStep} />

        {/* --- STEP CONTENT --- */}
        <div className="bg-card border border-border p-8 md:p-12 shadow-2xl relative overflow-hidden group">
          <div className="absolute top-0 left-0 w-1 h-full bg-primary/20 group-hover:bg-primary transition-colors" />

          <div className="space-y-8 animate-in fade-in slide-in-from-right-4 duration-500">
            {currentStep === 1 && <BasicsStep />}
            {currentStep === 2 && <LocationStep />}
            {currentStep === 3 && <ProtocolsStep />}
            {currentStep === 4 && <ReviewStep />}
          </div>
        </div>

        {/* --- NAVIGATION FOOTER --- */}
        <div className="flex items-center justify-between mt-10">
          <Button
            variant="ghost"
            onClick={prevStep}
            disabled={currentStep === 1 || createHotelMutation.isPending}
            className="rounded-none h-12 px-8 uppercase tracking-widest text-[10px] font-black"
          >
            <ChevronLeft className="w-4 h-4 mr-2" />
            Back
          </Button>

          {currentStep < 4 ? (
            <Button
              onClick={nextStep}
              disabled={!isStepValid()}
              className="rounded-none h-12 px-10 uppercase tracking-widest text-[10px] font-black"
            >
              Continue
              <ChevronRight className="w-4 h-4 ml-2" />
            </Button>
          ) : (
            <Button
              onClick={handleSubmit}
              disabled={createHotelMutation.isPending}
              className="rounded-none h-12 px-10 uppercase tracking-widest text-[10px] font-black shadow-[0_0_20px_hsl(var(--primary)/0.4)]"
            >
              {createHotelMutation.isPending ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Publishing...
                </>
              ) : (
                <>
                  Publish Estate
                  <Check className="w-4 h-4 ml-2" />
                </>
              )}
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
