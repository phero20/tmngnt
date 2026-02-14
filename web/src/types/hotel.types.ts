export interface Hotel {
  id: string;
  name: string;
  description: string | null;
  address: string;
  city: string;
  state: string | null;
  country: string;
  zipCode: string | null;
  latitude: number | null;
  longitude: number | null;
  contactPhone: string | null;
  contactEmail: string | null;
  checkInTime: string;
  checkOutTime: string;
  starRating: number;
  images: { id: string; url: string }[] | null;
  createdAt: string;
  updatedAt: string;
  amenities?: {
    amenity: {
      id: string;
      name: string;
      icon: string | null;
      category: string | null;
    };
  }[];
  rooms?: Room[];
}

export interface Room {
  id: string;
  hotelId: string;
  name: string;
  description: string | null;
  price: string;
  capacityAdults: number;
  capacityChildren: number;
  quantity: number;
  sizeSqFt: number | null;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface HotelResponse {
  data: Hotel[];
  meta?: {
    total: number;
    page: number;
    limit: number;
  };
}
