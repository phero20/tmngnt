'use client';

import { usePropertyFormStore } from '@/store/usePropertyFormStore';
import { useAmenities } from '@/hooks/useHotels';
import { Button } from '@/components/ui/button';
import { Hotel, Star, Trash2, Sparkles } from 'lucide-react';
import { useState } from 'react';

export const ReviewStep = () => {
  const { formData, updateFormData } = usePropertyFormStore();
  const { data: amenitiesData } = useAmenities();
  const [imageUrl, setImageUrl] = useState('');

  const addImage = () => {
    if (imageUrl && imageUrl.startsWith('http')) {
      const currentImages = formData.images || [];
      updateFormData({ images: [...currentImages, imageUrl] });
      setImageUrl('');
    }
  };

  const removeImage = (index: number) => {
    const currentImages = formData.images || [];
    updateFormData({ images: currentImages.filter((_, i) => i !== index) });
  };

  return (
    <div className="space-y-8">
      <div className="space-y-2">
        <h2 className="font-serif text-2xl">Gallery & Final Review</h2>
        <p className="text-muted-foreground text-sm font-sans">
          A picture is worth a thousand stays.
        </p>
      </div>

      {/* Image Section */}
      <div className="space-y-4">
        <div className="flex gap-2">
          <input
            type="url"
            value={imageUrl}
            onChange={(e) => setImageUrl(e.target.value)}
            placeholder="Enter Image URL (e.g. https://...)"
            className="flex-1 bg-background border border-border px-4 py-3 text-sm focus:outline-none focus:border-primary/50 transition-all font-sans"
          />
          <Button
            type="button"
            onClick={addImage}
            className="rounded-none px-6 uppercase tracking-widest text-[10px] font-black"
          >
            Add
          </Button>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {formData.images?.map((url, idx) => (
            <div
              key={idx}
              className="relative aspect-video group border border-border bg-muted overflow-hidden"
            >
              <img
                src={url}
                alt="Hotel Preview"
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                <button
                  type="button"
                  onClick={() => removeImage(idx)}
                  className="bg-destructive text-white p-2 rounded-full shadow-lg transform translate-y-2 group-hover:translate-y-0 transition-all"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
          {(!formData.images || formData.images.length === 0) && (
            <div className="aspect-video border border-dashed border-border flex flex-col items-center justify-center text-muted-foreground md:col-span-4 py-10">
              <Sparkles className="w-6 h-6 mb-2 opacity-20" />
              <p className="text-[10px] uppercase tracking-widest font-bold">
                No images added yet
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Final Summary Card */}
      <div className="border border-border bg-black/40 p-10 space-y-8 backdrop-blur-sm relative overflow-hidden">
        <div className="absolute top-0 right-0 p-4 opacity-5">
          <Hotel className="w-32 h-32" />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
          <div className="space-y-6">
            <div>
              <p className="text-[9px] uppercase tracking-[0.3em] font-black text-primary mb-1">
                Estate Name
              </p>
              <p className="text-2xl font-serif text-white">{formData.name}</p>
            </div>
            <div>
              <p className="text-[9px] uppercase tracking-[0.3em] font-black text-primary mb-1">
                Location
              </p>
              <p className="text-sm font-medium text-white/80 leading-relaxed">
                {formData.address}, {formData.city}, {formData.country}
              </p>
            </div>
            <div className="flex gap-2 flex-wrap">
              {formData.amenities?.map((id) => {
                const amenity = amenitiesData?.find((a) => a.id === id);
                return amenity ? (
                  <span
                    key={id}
                    className="text-[8px] uppercase tracking-widest font-black px-2 py-1 bg-white/5 border border-white/10 text-white/60"
                  >
                    {amenity.name}
                  </span>
                ) : null;
              })}
            </div>
          </div>
          <div className="space-y-6">
            <div>
              <p className="text-[9px] uppercase tracking-[0.3em] font-black text-primary mb-1">
                Contact Details
              </p>
              <p className="text-sm font-medium text-white/80">
                {formData.contactEmail}
              </p>
              <p className="text-sm font-medium text-white/80">
                {formData.contactPhone}
              </p>
            </div>
            <div className="grid grid-cols-2 gap-6">
              <div>
                <p className="text-[9px] uppercase tracking-[0.3em] font-black text-primary mb-1">
                  Schedule
                </p>
                <p className="text-xs font-bold text-white uppercase tracking-tighter">
                  In: {formData.checkInTime} / Out: {formData.checkOutTime}
                </p>
              </div>
              <div>
                <p className="text-[9px] uppercase tracking-[0.3em] font-black text-primary mb-1">
                  Classification
                </p>
                <div className="flex gap-0.5">
                  {Array.from({ length: formData.starRating }).map((_, i) => (
                    <Star
                      key={i}
                      className="w-3 h-3 text-primary fill-primary"
                    />
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
