'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  UpdateHotelSchema,
  UpdateHotelInput,
} from '@/lib/schemas/hotel.schema';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import {
  Loader2,
  Plus,
  X,
  Check,
  MapPin,
  Hotel,
  Image as ImageIcon,
  Star,
  AlertCircle,
  Trash2,
} from 'lucide-react';
import {
  useUpdateHotel,
  useAmenities,
  useDeleteHotel,
} from '@/hooks/useHotels';
import { useState } from 'react';
import { cn } from '@/lib/utils';
import { Hotel as HotelType } from '@/types/hotel.types';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';

interface EditPropertyFormProps {
  hotel: HotelType;
}

type Tab = 'general' | 'location' | 'amenities' | 'photos';

export default function EditPropertyForm({ hotel }: EditPropertyFormProps) {
  const router = useRouter();
  const { mutate: updateHotel, isPending } = useUpdateHotel(hotel.id);
  const { mutate: deleteHotel, isPending: isDeleting } = useDeleteHotel();
  const { data: amenitiesList, isLoading: isLoadingAmenities } = useAmenities();

  const [activeTab, setActiveTab] = useState<Tab>('general');
  const [imageUrl, setImageUrl] = useState('');

  const handleDelete = () => {
    deleteHotel(hotel.id, {
      onSuccess: () => {
        toast.success('Property archived successfully');
        router.push('/dashboard/host/properties');
      },
      onError: (error) => {
        console.error(error);
        toast.error('Failed to delete property');
      },
    });
  };

  const form = useForm<UpdateHotelInput>({
    resolver: zodResolver(UpdateHotelSchema),
    defaultValues: {
      name: hotel.name,
      description: hotel.description || '',
      contactEmail: hotel.contactEmail || '',
      contactPhone: hotel.contactPhone || '',
      starRating: hotel.starRating || 0,
      address: hotel.address,
      city: hotel.city,
      country: hotel.country,
      state: hotel.state || '',
      zipCode: hotel.zipCode || '',
      latitude: hotel.latitude
        ? parseFloat(hotel.latitude.toString())
        : undefined,
      longitude: hotel.longitude
        ? parseFloat(hotel.longitude.toString())
        : undefined,
      checkInTime: hotel.checkInTime || '14:00',
      checkOutTime: hotel.checkOutTime || '11:00',
      // @ts-ignore
      amenities:
        hotel.amenities
          ?.map((a: any) => a.amenity?.id || a.id)
          .filter(Boolean) || [],
      // @ts-ignore
      images: hotel.images?.map((i) => i.url) || [],
    },
  });

  const currentAmenities = form.watch('amenities') || [];
  const currentImages = form.watch('images') || [];

  function onSubmit(values: UpdateHotelInput) {
    updateHotel(values, {
      onSuccess: () => {
        toast.success('Property updated successfully');
        // Redirect back to property dashboard
        router.push(`/dashboard/host/properties/${hotel.id}`);
      },
      onError: (error) => {
        toast.error('Failed to update property');
        console.error(error);
      },
    });
  }

  const toggleAmenity = (amenityId: string) => {
    const current = form.getValues('amenities') || [];
    if (current.includes(amenityId)) {
      form.setValue(
        'amenities',
        current.filter((id) => id !== amenityId)
      );
    } else {
      form.setValue('amenities', [...current, amenityId]);
    }
  };

  const addImage = () => {
    if (!imageUrl) return;
    try {
      new URL(imageUrl);
      const current = form.getValues('images') || [];
      form.setValue('images', [...current, imageUrl]);
      setImageUrl('');
    } catch (e) {
      form.setError('images', { message: 'Invalid URL format' });
    }
  };

  const removeImage = (index: number) => {
    const current = form.getValues('images') || [];
    form.setValue(
      'images',
      current.filter((_, i) => i !== index)
    );
  };

  // Helper for Number Inputs to avoid NaN issues
  const numberInputProps = (field: any) => ({
    ...field,
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => {
      const val = e.target.value;
      field.onChange(val === '' ? undefined : parseFloat(val));
    },
    value: field.value ?? '',
  });

  // Check if a tab has errors
  const tabHasError = (tab: Tab) => {
    const errors = form.formState.errors;
    switch (tab) {
      case 'general':
        return !!(
          errors.name ||
          errors.description ||
          errors.contactEmail ||
          errors.contactPhone ||
          errors.starRating
        );
      case 'location':
        return !!(
          errors.address ||
          errors.city ||
          errors.country ||
          errors.state ||
          errors.zipCode ||
          errors.latitude ||
          errors.longitude
        );
      case 'amenities':
        return !!errors.amenities;
      case 'photos':
        return !!errors.images;
      default:
        return false;
    }
  };

  return (
    <div className="space-y-6">
      {/* Tabs Header */}
      <div className="flex items-center gap-1 border-b border-border overflow-x-auto pb-1">
        <button
          onClick={() => setActiveTab('general')}
          type="button"
          className={cn(
            'px-4 py-2 text-sm font-medium border-b-2 transition-colors whitespace-nowrap flex items-center gap-2',
            activeTab === 'general'
              ? 'border-primary text-primary'
              : 'border-transparent text-muted-foreground hover:text-foreground',
            tabHasError('general') && 'text-destructive border-destructive/50'
          )}
        >
          General Info
          {tabHasError('general') && <AlertCircle className="w-3 h-3" />}
        </button>
        <button
          onClick={() => setActiveTab('location')}
          type="button"
          className={cn(
            'px-4 py-2 text-sm font-medium border-b-2 transition-colors whitespace-nowrap flex items-center gap-2',
            activeTab === 'location'
              ? 'border-primary text-primary'
              : 'border-transparent text-muted-foreground hover:text-foreground',
            tabHasError('location') && 'text-destructive border-destructive/50'
          )}
        >
          Location
          {tabHasError('location') && <AlertCircle className="w-3 h-3" />}
        </button>
        <button
          onClick={() => setActiveTab('amenities')}
          type="button"
          className={cn(
            'px-4 py-2 text-sm font-medium border-b-2 transition-colors whitespace-nowrap flex items-center gap-2',
            activeTab === 'amenities'
              ? 'border-primary text-primary'
              : 'border-transparent text-muted-foreground hover:text-foreground',
            tabHasError('amenities') && 'text-destructive border-destructive/50'
          )}
        >
          Amenities
          {tabHasError('amenities') && <AlertCircle className="w-3 h-3" />}
        </button>
        <button
          onClick={() => setActiveTab('photos')}
          type="button"
          className={cn(
            'px-4 py-2 text-sm font-medium border-b-2 transition-colors whitespace-nowrap flex items-center gap-2',
            activeTab === 'photos'
              ? 'border-primary text-primary'
              : 'border-transparent text-muted-foreground hover:text-foreground',
            tabHasError('photos') && 'text-destructive border-destructive/50'
          )}
        >
          Photos
          {tabHasError('photos') && <AlertCircle className="w-3 h-3" />}
        </button>
      </div>

      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit, (errors) => {
            const errorFields = Object.keys(errors).join(', ');
            console.error('Form Validation Errors:', errors);
            toast.error(`Validation failed. Please check: ${errorFields}`);
          })}
          className="space-y-8"
        >
          {/* General Tab */}
          <div className={cn('space-y-6', activeTab !== 'general' && 'hidden')}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem className="md:col-span-2">
                    <FormLabel>
                      Property Name <span className="text-destructive">*</span>
                    </FormLabel>
                    <FormControl>
                      <Input placeholder="e.g. Grand Plaza Hotel" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem className="md:col-span-2">
                    <FormLabel>Description</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Describe the experience..."
                        className="resize-none h-32"
                        {...field}
                        value={field.value || ''}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="contactEmail"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Contact Email</FormLabel>
                    <FormControl>
                      <Input
                        type="email"
                        {...field}
                        value={field.value || ''}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="contactPhone"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Contact Phone</FormLabel>
                    <FormControl>
                      <Input type="tel" {...field} value={field.value || ''} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="starRating"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Star Rating (0-5)</FormLabel>
                    <FormControl>
                      <div className="flex items-center gap-2">
                        <Input
                          type="number"
                          min="0"
                          max="5"
                          {...numberInputProps(field)}
                          className="w-24"
                        />
                        <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </div>

          {/* Location Tab */}
          <div
            className={cn('space-y-6', activeTab !== 'location' && 'hidden')}
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FormField
                control={form.control}
                name="address"
                render={({ field }) => (
                  <FormItem className="md:col-span-2">
                    <FormLabel>
                      Street Address <span className="text-destructive">*</span>
                    </FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="city"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      City <span className="text-destructive">*</span>
                    </FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="country"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      Country <span className="text-destructive">*</span>
                    </FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="state"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>State / Province</FormLabel>
                    <FormControl>
                      <Input {...field} value={field.value || ''} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="zipCode"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Zip / Postal Code</FormLabel>
                    <FormControl>
                      <Input {...field} value={field.value || ''} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="latitude"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Latitude</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        step="any"
                        placeholder="e.g. 40.7128"
                        {...numberInputProps(field)}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="longitude"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Longitude</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        step="any"
                        placeholder="e.g. -74.0060"
                        {...numberInputProps(field)}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </div>

          {/* Amenities Tab */}
          <div
            className={cn('space-y-6', activeTab !== 'amenities' && 'hidden')}
          >
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-medium">Select Amenities</h3>
              {isLoadingAmenities && (
                <Loader2 className="w-4 h-4 animate-spin" />
              )}
            </div>

            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
              {amenitiesList?.map((amenity) => (
                <button
                  key={amenity.id}
                  type="button"
                  onClick={() => toggleAmenity(amenity.id)}
                  className={cn(
                    'text-left px-3 py-2 border text-xs font-medium rounded-md transition-all flex items-center justify-between',
                    currentAmenities.includes(amenity.id)
                      ? 'border-primary bg-primary/5 text-primary'
                      : 'border-input hover:border-primary/50 text-muted-foreground'
                  )}
                >
                  <span className="truncate pr-2">{amenity.name}</span>
                  {currentAmenities.includes(amenity.id) && (
                    <Check className="w-3.5 h-3.5 shrink-0" />
                  )}
                </button>
              ))}
            </div>
          </div>

          {/* Photos Tab */}
          <div className={cn('space-y-6', activeTab !== 'photos' && 'hidden')}>
            <div className="flex gap-2">
              <Input
                placeholder="https://example.com/property-image.jpg"
                value={imageUrl}
                onChange={(e) => setImageUrl(e.target.value)}
                className="flex-1"
              />
              <Button type="button" variant="secondary" onClick={addImage}>
                <Plus className="w-4 h-4 mr-2" /> Add Photo
              </Button>
            </div>
            <FormMessage>{form.formState.errors.images?.message}</FormMessage>

            {currentImages.length > 0 ? (
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4">
                {currentImages.map((url, index) => (
                  <div
                    key={index}
                    className="relative group aspect-video bg-muted rounded-md overflow-hidden border border-border"
                  >
                    <img
                      src={url}
                      alt={`Property ${index + 1}`}
                      className="w-full h-full object-cover"
                    />
                    <button
                      type="button"
                      onClick={() => removeImage(index)}
                      className="absolute top-1 right-1 p-1 bg-black/50 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity hover:bg-destructive"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-10 border border-dashed rounded-lg text-muted-foreground text-sm">
                No images added yet. Add some to showcase your property.
              </div>
            )}
          </div>

          {/* Validation Error Summary */}
          {Object.keys(form.formState.errors).length > 0 && (
            <div className="flex flex-col gap-2 text-destructive bg-destructive/10 p-4 rounded-md text-sm">
              <div className="flex items-center gap-2 font-bold">
                <AlertCircle className="w-4 h-4" />
                Validation Errors found:
              </div>
              <ul className="list-disc pl-5 space-y-1">
                {Object.entries(form.formState.errors).map(([key, error]) => (
                  <li key={key}>
                    <span className="font-semibold capitalize">{key}</span>:{' '}
                    {(error as any)?.message || 'Invalid value'}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Footer Actions */}
          <div className="flex justify-end pt-6 border-t border-border">
            <Button
              type="submit"
              size="lg"
              className="min-w-[150px]"
              disabled={isPending}
            >
              {isPending ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Saving...
                </>
              ) : (
                'Save Changes'
              )}
            </Button>
          </div>
        </form>
      </Form>

      {/* Danger Area */}
      <div className="border border-destructive/20 rounded-lg p-6 bg-destructive/5 space-y-4">
        <div className="flex items-center gap-2 text-destructive font-medium">
          <Trash2 className="w-5 h-5" />
          <h3 className="text-lg font-serif">Danger Zone</h3>
        </div>
        <p className="text-sm text-muted-foreground">
          Archiving this property will hide it from guests and remove it from
          search results. You can restore it from your dashboard anytime.
        </p>

        <AlertDialog>
          <AlertDialogTrigger asChild>
            <Button variant="destructive">Archive Property</Button>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
              <AlertDialogDescription>
                This action will archive the property{' '}
                <strong>{hotel.name}</strong>. It will no longer be visible to
                guests.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction
                onClick={handleDelete}
                className="bg-destructive hover:bg-destructive/90 text-destructive-foreground"
              >
                {isDeleting ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  'Yes, Archive Property'
                )}
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </div>
  );
}
