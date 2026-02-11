'use client';

import { Hotel as HotelIcon, Pencil, Trash, Power } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Room } from '@/types/hotel.types';
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
import { useDeleteRoom, useReactivateRoom } from '@/hooks/useHotels';

interface PropertyRoomsListProps {
  rooms?: Room[];
  hotelId: string;
}

export function PropertyRoomsList({ rooms, hotelId }: PropertyRoomsListProps) {
  const { mutate: deleteRoom, isPending: isDeleting } = useDeleteRoom(hotelId);
  const { mutate: reactivateRoom, isPending: isReactivating } =
    useReactivateRoom(hotelId);

  const handleDelete = (roomId: string) => {
    deleteRoom(roomId);
  };

  const handleReactivate = (roomId: string) => {
    reactivateRoom(roomId);
  };

  return (
    <div className="space-y-4 pt-4 border-t border-border">
      <div className="flex items-center justify-between">
        <h2 className="font-serif text-lg font-medium flex items-center gap-2">
          <HotelIcon className="w-4 h-4 text-primary" />
          Available Rooms
        </h2>
        <Button variant="outline" size="sm" asChild>
          <Link href={`/dashboard/host/properties/${hotelId}/rooms/new`}>
            Add Room
          </Link>
        </Button>
      </div>

      {rooms && rooms.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 animate-in fade-in transition-all duration-300">
          {rooms.map((room) => (
            <div
              key={room.id}
              className={`group bg-card border border-border p-4 space-y-3 transition-all relative overflow-hidden ${
                room.isActive
                  ? 'hover:border-primary/50 hover:shadow-lg'
                  : 'opacity-75 bg-muted/30 border-dashed hover:opacity-100 hover:border-primary/30'
              }`}
            >
              {/* Actions Overlay */}
              <div className="flex items-center gap-2 absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity z-10">
                {room.isActive ? (
                  <>
                    <Button
                      asChild
                      variant="secondary"
                      size="icon"
                      className="h-8 w-8 rounded-full shadow-sm"
                    >
                      <Link
                        href={`/dashboard/host/properties/${hotelId}/rooms/${room.id}/edit`}
                      >
                        <Pencil className="w-3.5 h-3.5" />
                      </Link>
                    </Button>

                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button
                          variant="destructive"
                          size="icon"
                          className="h-8 w-8 rounded-full shadow-sm"
                          disabled={isDeleting}
                        >
                          <Trash className="w-3.5 h-3.5" />
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>Delete this Room?</AlertDialogTitle>
                          <AlertDialogDescription>
                            This action cannot be undone. This will permanently
                            delete the <strong>{room.name}</strong> room type
                            from your property.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Cancel</AlertDialogCancel>
                          <AlertDialogAction
                            onClick={() => handleDelete(room.id)}
                            className="bg-destructive hover:bg-destructive/90"
                          >
                            Delete
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </>
                ) : (
                  <Button
                    variant="secondary"
                    size="icon"
                    className="h-8 w-8 rounded-full shadow-sm bg-green-100 text-green-700 hover:bg-green-200 hover:text-green-800"
                    disabled={isReactivating}
                    onClick={() => handleReactivate(room.id)}
                    title="Reactivate Room"
                  >
                    <Power className="w-3.5 h-3.5" />
                  </Button>
                )}
              </div>

              <div className="flex justify-between items-start pr-12">
                <div className="space-y-1">
                  <h3 className="font-serif text-base font-medium truncate max-w-[180px]">
                    {room.name}
                  </h3>
                  {/* Status Indicator */}
                  <span
                    className={`inline-flex items-center px-1.5 py-0.5 rounded text-[9px] font-bold uppercase tracking-wider ${
                      room.isActive
                        ? 'bg-primary/10 text-primary'
                        : 'bg-muted text-muted-foreground'
                    }`}
                  >
                    {room.isActive ? 'Active' : 'Archived'}
                  </span>
                </div>
                <div className="text-right">
                  <span className="text-sm font-bold text-primary block">
                    ${room.price}
                    <span className="text-[10px] items-center font-normal text-muted-foreground ml-1 uppercase">
                      / Night
                    </span>
                  </span>
                </div>
              </div>

              <p className="text-xs text-muted-foreground line-clamp-2 h-8">
                {room.description || 'No description available for this room.'}
              </p>

              <div className="flex justify-between items-center text-[10px] uppercase tracking-wider text-muted-foreground pt-3 border-t border-border/50">
                <span className="flex items-center gap-1">
                  Adults:
                  <span className="text-foreground font-bold">
                    {room.capacityAdults}
                  </span>
                </span>
                <span className="flex items-center gap-1">
                  Kids:
                  <span className="text-foreground font-bold">
                    {room.capacityChildren}
                  </span>
                </span>
                {room.sizeSqFt && (
                  <span className="flex items-center gap-1">
                    {room.sizeSqFt} sq ft
                  </span>
                )}
                <span className="flex items-center gap-1">
                  Qty:
                  <span className="text-foreground font-bold">
                    {room.quantity}
                  </span>
                </span>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-12 bg-muted/20 border border-dashed border-border rounded-lg animate-in zoom-in-95 duration-300">
          <p className="text-sm text-muted-foreground italic mb-4">
            No rooms have been added to this property yet.
          </p>
          <Button variant="outline" size="sm" asChild>
            <Link href={`/dashboard/host/properties/${hotelId}/rooms/new`}>
              Add First Room
            </Link>
          </Button>
        </div>
      )}
    </div>
  );
}
