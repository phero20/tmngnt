import { Hotel } from 'lucide-react';

interface PropertyGalleryProps {
  images: { id: string; url: string }[] | null;
  hotelName: string;
}

export function PropertyGallery({ images, hotelName }: PropertyGalleryProps) {
  return (
    <div className="aspect-video bg-muted border border-border overflow-hidden relative group">
      {images && images.length > 0 ? (
        <img
          src={images[0].url}
          alt={hotelName}
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
        />
      ) : (
        <div className="w-full h-full flex flex-col items-center justify-center text-muted-foreground bg-card/50">
          <Hotel className="w-12 h-12 mb-2 opacity-20" />
          <p className="text-[10px] uppercase tracking-widest font-bold">
            No Image Available
          </p>
        </div>
      )}
    </div>
  );
}
