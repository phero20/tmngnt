'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { CreateRoomSchema, CreateRoomInput } from '@/lib/schemas/hotel.schema';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Loader2, Plus, X, Image as ImageIcon, Check } from 'lucide-react';
import { useCreateRoom, useAmenities } from '@/hooks/useHotels';
import { useState } from 'react';
import { cn } from '@/lib/utils';

interface RoomFormProps {
  hotelId: string;
}

export default function RoomForm({ hotelId }: RoomFormProps) {
  const { mutate: createRoom, isPending } = useCreateRoom(hotelId);
  const { data: amenitiesList, isLoading: isLoadingAmenities } = useAmenities();

  // Local state for image input
  const [imageUrl, setImageUrl] = useState('');

  const form = useForm<CreateRoomInput>({
    resolver: zodResolver(CreateRoomSchema),
    defaultValues: {
      name: '',
      description: '',
      price: 0,
      capacityAdults: 2,
      capacityChildren: 0,
      quantity: 1,
      sizeSqFt: undefined,
      amenities: [],
      images: [],
    },
  });

  const currentAmenities = form.watch('amenities') || [];
  const currentImages = form.watch('images') || [];

  function onSubmit(values: CreateRoomInput) {
    createRoom(values);
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
      new URL(imageUrl); // Simple validation
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

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        {/* Basic Info */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Room Name</FormLabel>
                <FormControl>
                  <Input placeholder="e.g. Deluxe Ocean View" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="price"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Price per Night</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    placeholder="0.00"
                    {...field}
                    onChange={(e) => field.onChange(parseFloat(e.target.value))}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Description</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Describe the room features, view, and layout..."
                  className="resize-none h-32"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Room Details */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <FormField
            control={form.control}
            name="capacityAdults"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Adults</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    min={1}
                    {...field}
                    onChange={(e) => field.onChange(parseInt(e.target.value))}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="capacityChildren"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Children</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    min={0}
                    {...field}
                    onChange={(e) => field.onChange(parseInt(e.target.value))}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="quantity"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Total Units</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    min={1}
                    {...field}
                    onChange={(e) => field.onChange(parseInt(e.target.value))}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="sizeSqFt"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Size (Sq Ft)</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    placeholder="Optional"
                    {...field}
                    onChange={(e) =>
                      field.onChange(
                        e.target.value ? parseInt(e.target.value) : undefined
                      )
                    }
                    value={field.value || ''}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <hr className="border-border" />

        {/* Amenities Section */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-medium text-sm">Room Amenities</h3>
            {isLoadingAmenities && (
              <Loader2 className="w-4 h-4 animate-spin text-muted-foreground" />
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
                  <Check className="w-3.5 h-3.5 flex-shrink-0" />
                )}
              </button>
            ))}
          </div>
          <div className="text-[10px] text-muted-foreground">
            Select all amenities available in this room type.
          </div>
        </div>

        <hr className="border-border" />

        {/* Images Section */}
        <div className="space-y-4">
          <h3 className="font-medium text-sm">Room Images</h3>

          <div className="flex gap-2">
            <Input
              placeholder="https://example.com/room-image.jpg"
              value={imageUrl}
              onChange={(e) => setImageUrl(e.target.value)}
              className="flex-1"
            />
            <Button type="button" variant="secondary" onClick={addImage}>
              <Plus className="w-4 h-4 mr-2" /> Add
            </Button>
          </div>
          <FormMessage>{form.formState.errors.images?.message}</FormMessage>

          {currentImages.length > 0 && (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4">
              {currentImages.map((url, index) => (
                <div
                  key={index}
                  className="relative group aspect-video bg-muted rounded-md overflow-hidden border border-border"
                >
                  <img
                    src={url}
                    alt={`Room ${index + 1}`}
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
          )}
        </div>

        <Button type="submit" className="w-full" disabled={isPending}>
          {isPending ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Creating Room...
            </>
          ) : (
            'Create Room'
          )}
        </Button>
      </form>
    </Form>
  );
}
