'use client';

import { usePropertyFormStore } from '@/store/usePropertyFormStore';
import { Hotel, Mail, Phone, Star } from 'lucide-react';
import { cn } from '@/lib/utils';

export const BasicsStep = () => {
  const { formData, updateFormData } = usePropertyFormStore();

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <h2 className="font-serif text-2xl">Soul & Contact</h2>
        <p className="text-muted-foreground text-sm font-sans">
          Let's start with the heritage and identity of your estate.
        </p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2 md:col-span-2">
          <label className="text-[10px] uppercase tracking-widest font-black text-primary">
            Estate Name
          </label>
          <div className="relative">
            <Hotel className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <input
              type="text"
              value={formData.name}
              onChange={(e) => updateFormData({ name: e.target.value })}
              placeholder="e.g. Grand Plaza Heritage"
              className="w-full bg-background border border-border pl-12 pr-4 py-3 text-sm focus:outline-none focus:border-primary/50 transition-all font-sans"
            />
          </div>
        </div>
        <div className="space-y-2 md:col-span-2">
          <label className="text-[10px] uppercase tracking-widest font-black text-primary">
            Description
          </label>
          <textarea
            rows={4}
            value={formData.description}
            onChange={(e) => updateFormData({ description: e.target.value })}
            placeholder="Describe the unique philosophy and luxury of your estate..."
            className="w-full bg-background border border-border px-4 py-3 text-sm focus:outline-none focus:border-primary/50 transition-all font-sans resize-none"
          />
        </div>
        <div className="space-y-2">
          <label className="text-[10px] uppercase tracking-widest font-black text-primary">
            Email Address
          </label>
          <div className="relative">
            <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <input
              type="email"
              value={formData.contactEmail}
              onChange={(e) => updateFormData({ contactEmail: e.target.value })}
              className="w-full bg-background border border-border pl-12 pr-4 py-3 text-sm focus:outline-none focus:border-primary/50 transition-all"
            />
          </div>
        </div>
        <div className="space-y-2">
          <label className="text-[10px] uppercase tracking-widest font-black text-primary">
            Phone Number
          </label>
          <div className="relative">
            <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <input
              type="tel"
              value={formData.contactPhone}
              onChange={(e) => updateFormData({ contactPhone: e.target.value })}
              className="w-full bg-background border border-border pl-12 pr-4 py-3 text-sm focus:outline-none focus:border-primary/50 transition-all"
            />
          </div>
        </div>
        <div className="space-y-2">
          <label className="text-[10px] uppercase tracking-widest font-black text-primary">
            Luxury Rating (Stars)
          </label>
          <div className="flex items-center gap-2">
            {[1, 2, 3, 4, 5].map((star) => (
              <button
                key={star}
                type="button"
                onClick={() => updateFormData({ starRating: star })}
                className={cn(
                  'p-2 border transition-all',
                  formData.starRating >= star
                    ? 'border-primary bg-primary/10 text-primary'
                    : 'border-border text-muted-foreground'
                )}
              >
                <Star
                  className={cn(
                    'w-4 h-4',
                    formData.starRating >= star && 'fill-primary'
                  )}
                />
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
