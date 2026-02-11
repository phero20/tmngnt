'use client';

import { usePropertyFormStore } from '@/store/usePropertyFormStore';
import { Globe } from 'lucide-react';

export const LocationStep = () => {
  const { formData, updateFormData } = usePropertyFormStore();

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <h2 className="font-serif text-2xl">Geography & Map</h2>
        <p className="text-muted-foreground text-sm font-sans">
          Precision is key to high-end hospitality.
        </p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="space-y-2 md:col-span-3">
          <label className="text-[10px] uppercase tracking-widest font-black text-primary">
            Street Address
          </label>
          <input
            type="text"
            value={formData.address}
            onChange={(e) => updateFormData({ address: e.target.value })}
            className="w-full bg-background border border-border px-4 py-3 text-sm focus:outline-none focus:border-primary/50 transition-all font-sans"
          />
        </div>
        <div className="space-y-2">
          <label className="text-[10px] uppercase tracking-widest font-black text-primary">
            City
          </label>
          <input
            type="text"
            value={formData.city}
            onChange={(e) => updateFormData({ city: e.target.value })}
            className="w-full bg-background border border-border px-4 py-3 text-sm focus:outline-none focus:border-primary/50 transition-all font-sans"
          />
        </div>
        <div className="space-y-2">
          <label className="text-[10px] uppercase tracking-widest font-black text-primary">
            State / Province
          </label>
          <input
            type="text"
            value={formData.state}
            onChange={(e) => updateFormData({ state: e.target.value })}
            className="w-full bg-background border border-border px-4 py-3 text-sm focus:outline-none focus:border-primary/50 transition-all font-sans"
          />
        </div>
        <div className="space-y-2">
          <label className="text-[10px] uppercase tracking-widest font-black text-primary">
            Zip / Postal Code
          </label>
          <input
            type="text"
            value={formData.zipCode}
            onChange={(e) => updateFormData({ zipCode: e.target.value })}
            className="w-full bg-background border border-border px-4 py-3 text-sm focus:outline-none focus:border-primary/50 transition-all font-sans"
          />
        </div>
        <div className="space-y-2 md:col-span-3">
          <label className="text-[10px] uppercase tracking-widest font-black text-primary">
            Country
          </label>
          <div className="relative">
            <Globe className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <input
              type="text"
              value={formData.country}
              onChange={(e) => updateFormData({ country: e.target.value })}
              className="w-full bg-background border border-border pl-12 pr-4 py-3 text-sm focus:outline-none focus:border-primary/50 transition-all font-sans"
            />
          </div>
        </div>
        <div className="space-y-2">
          <label className="text-[10px] uppercase tracking-widest font-black text-primary">
            Latitude
          </label>
          <input
            type="number"
            step="any"
            value={formData.latitude || ''}
            onChange={(e) =>
              updateFormData({
                latitude: e.target.value ? Number(e.target.value) : undefined,
              })
            }
            placeholder="e.g. 17.3850"
            className="w-full bg-background border border-border px-4 py-3 text-sm focus:outline-none focus:border-primary/50 transition-all font-sans"
          />
        </div>
        <div className="space-y-2">
          <label className="text-[10px] uppercase tracking-widest font-black text-primary">
            Longitude
          </label>
          <input
            type="number"
            step="any"
            value={formData.longitude || ''}
            onChange={(e) =>
              updateFormData({
                longitude: e.target.value ? Number(e.target.value) : undefined,
              })
            }
            placeholder="e.g. 78.4867"
            className="w-full bg-background border border-border px-4 py-3 text-sm focus:outline-none focus:border-primary/50 transition-all font-sans"
          />
        </div>
      </div>
    </div>
  );
};
