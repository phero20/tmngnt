import { create } from 'zustand';
import type { CreateHotelInput } from '@/lib/schemas/hotel.schema';

interface PropertyFormState {
  // --- FORM DATA ---
  formData: CreateHotelInput;
  currentStep: number;
  isSubmitting: boolean;

  // --- ACTIONS ---
  updateFormData: (data: Partial<CreateHotelInput>) => void;
  nextStep: () => void;
  prevStep: () => void;
  setStep: (step: number) => void;
  resetForm: () => void;
  setSubmitting: (isSubmitting: boolean) => void;
}

const initialFormData: CreateHotelInput = {
  name: '',
  description: '',
  address: '',
  city: '',
  state: '',
  country: '',
  zipCode: '',
  latitude: undefined,
  longitude: undefined,
  contactPhone: '',
  contactEmail: '',
  checkInTime: '14:00',
  checkOutTime: '11:00',
  starRating: 0,
  amenities: [],
  images: [],
};

export const usePropertyFormStore = create<PropertyFormState>((set) => ({
  formData: initialFormData,
  currentStep: 1,
  isSubmitting: false,

  updateFormData: (data) =>
    set((state) => ({
      formData: { ...state.formData, ...data },
    })),

  nextStep: () => set((state) => ({ currentStep: state.currentStep + 1 })),
  prevStep: () =>
    set((state) => ({ currentStep: Math.max(1, state.currentStep - 1) })),
  setStep: (step) => set({ currentStep: step }),

  resetForm: () =>
    set({
      formData: initialFormData,
      currentStep: 1,
      isSubmitting: false,
    }),

  setSubmitting: (isSubmitting) => set({ isSubmitting }),
}));
