'use client';

import {
  Wifi,
  Waves,
  Car,
  Dumbbell,
  Sparkles,
  Utensils,
  GlassWater,
  Coffee,
  Tv,
  Wind,
  Dog,
  Palmtree,
  ChefHat,
  WashingMachine,
  Bell,
  Lock,
  Refrigerator,
  Monitor,
  Bath,
  Droplets,
  HelpCircle,
  LucideProps,
} from 'lucide-react';

interface DynamicIconProps extends LucideProps {
  name: string;
}

/**
 * Optimized DynamicIcon
 * Manually map strings to pre-imported icons to avoid
 * importing the entire lucide-react library (which causes massive hangs).
 */
export const DynamicIcon = ({ name, ...props }: DynamicIconProps) => {
  const mapping: Record<string, React.ElementType> = {
    wifi: Wifi,
    pool: Waves,
    parking: Car,
    gym: Dumbbell,
    spa: Sparkles,
    restaurant: Utensils,
    bar: GlassWater,
    coffee: Coffee,
    tv: Tv,
    ac: Wind,
    breakfast: Coffee,
    pet: Dog,
    beach: Palmtree,
    kitchen: ChefHat,
    laundry: WashingMachine,
    'room-service': Bell,
    safe: Lock,
    minibar: Refrigerator,
    desk: Monitor,
    tub: Bath,
    shower: Droplets,
  };

  const IconComponent = mapping[name.toLowerCase()] || HelpCircle;

  return <IconComponent {...props} />;
};
