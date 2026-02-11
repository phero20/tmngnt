'use client';

import { usePropertyFormStore } from '@/store/usePropertyFormStore';
import { useAmenities, useCreateAmenity } from '@/hooks/useHotels';
import { Button } from '@/components/ui/button';
import { Clock, Loader2, Plus, Zap, Check } from 'lucide-react';
import { useState } from 'react';
import { cn } from '@/lib/utils';

export const ProtocolsStep = () => {
  const { formData, updateFormData } = usePropertyFormStore();
  const { data: amenitiesData, isLoading: isLoadingAmenities } = useAmenities();
  const createAmenityMutation = useCreateAmenity();

  const [newAmenityName, setNewAmenityName] = useState('');
  const [showAmenityInput, setShowAmenityInput] = useState(false);

  const toggleAmenity = (amenityId: string) => {
    const currentAmenities = formData.amenities || [];
    if (currentAmenities.includes(amenityId)) {
      updateFormData({
        amenities: currentAmenities.filter((id) => id !== amenityId),
      });
    } else {
      updateFormData({ amenities: [...currentAmenities, amenityId] });
    }
  };

  const handleAddCustomAmenity = () => {
    if (newAmenityName.length >= 2) {
      createAmenityMutation.mutate(
        { name: newAmenityName },
        {
          onSuccess: (response: any) => {
            const newAmenity = response.data;
            if (newAmenity && newAmenity.id) {
              toggleAmenity(newAmenity.id);
            }
            setNewAmenityName('');
            setShowAmenityInput(false);
          },
        }
      );
    }
  };

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <h2 className="font-serif text-2xl">Protocol & Amenities</h2>
        <p className="text-muted-foreground text-sm font-sans">
          Define the rules and selection of your property.
        </p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="space-y-6">
          <div className="space-y-4">
            <h3 className="text-[11px] uppercase tracking-[0.2em] font-black text-primary flex items-center gap-2">
              <Clock className="w-4 h-4" /> Timings
            </h3>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-[9px] uppercase tracking-widest font-bold text-muted-foreground">
                  Check-in
                </label>
                <input
                  type="time"
                  value={formData.checkInTime}
                  onChange={(e) =>
                    updateFormData({ checkInTime: e.target.value })
                  }
                  className="w-full bg-background border border-border px-4 py-3 text-xs focus:border-primary/50 transition-all font-sans"
                />
              </div>
              <div className="space-y-2">
                <label className="text-[9px] uppercase tracking-widest font-bold text-muted-foreground">
                  Check-out
                </label>
                <input
                  type="time"
                  value={formData.checkOutTime}
                  onChange={(e) =>
                    updateFormData({ checkOutTime: e.target.value })
                  }
                  className="w-full bg-background border border-border px-4 py-3 text-xs focus:border-primary/50 transition-all font-sans"
                />
              </div>
            </div>
          </div>
        </div>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-[11px] uppercase tracking-[0.2em] font-black text-primary flex items-center gap-2">
              <Zap className="w-4 h-4" /> Amenities
            </h3>
            <button
              type="button"
              onClick={() => setShowAmenityInput(!showAmenityInput)}
              className="text-[9px] uppercase tracking-widest font-bold text-primary hover:underline flex items-center gap-1"
            >
              <Plus className="w-3 h-3" /> Custom
            </button>
          </div>

          {showAmenityInput && (
            <div className="flex gap-2 p-3 bg-primary/5 border border-primary/20 animate-in fade-in slide-in-from-top-1">
              <input
                type="text"
                value={newAmenityName}
                onChange={(e) => setNewAmenityName(e.target.value)}
                placeholder="e.g. Infinity Pool"
                className="flex-1 bg-background border border-border px-3 py-2 text-xs focus:outline-none focus:border-primary/50 font-sans"
              />
              <Button
                type="button"
                size="sm"
                onClick={handleAddCustomAmenity}
                disabled={
                  newAmenityName.length < 2 || createAmenityMutation.isPending
                }
                className="rounded-none h-8"
              >
                {createAmenityMutation.isPending ? (
                  <Loader2 className="w-3 h-3 animate-spin" />
                ) : (
                  'Add'
                )}
              </Button>
            </div>
          )}

          {isLoadingAmenities ? (
            <div className="flex items-center gap-2 py-4">
              <Loader2 className="w-4 h-4 animate-spin text-primary" />
              <span className="text-xs text-muted-foreground uppercase tracking-widest font-bold">
                Syncing...
              </span>
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-2 max-h-48 overflow-y-auto pr-2 custom-scrollbar">
              {amenitiesData?.map((amenity) => (
                <button
                  key={amenity.id}
                  type="button"
                  onClick={() => toggleAmenity(amenity.id)}
                  className={cn(
                    'text-left px-3 py-2 border text-[10px] font-bold uppercase tracking-wider transition-all flex items-center justify-between group',
                    formData.amenities?.includes(amenity.id)
                      ? 'border-primary bg-primary/5 text-primary'
                      : 'border-border text-muted-foreground hover:border-primary/30'
                  )}
                >
                  <span className="truncate pr-2">{amenity.name}</span>
                  {formData.amenities?.includes(amenity.id) && (
                    <Check className="w-3 h-3 flex-shrink-0" />
                  )}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
