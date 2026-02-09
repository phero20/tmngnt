CREATE TYPE "public"."booking_status" AS ENUM('PENDING', 'CONFIRMED', 'CANCELLED', 'COMPLETED');--> statement-breakpoint
CREATE TYPE "public"."payment_status" AS ENUM('PENDING', 'PAID', 'FAILED', 'REFUNDED');--> statement-breakpoint
CREATE TABLE "booking" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"userId" text NOT NULL,
	"hotelId" uuid NOT NULL,
	"roomId" uuid NOT NULL,
	"checkIn" date NOT NULL,
	"checkOut" date NOT NULL,
	"totalPrice" numeric(10, 2) NOT NULL,
	"currency" text DEFAULT 'USD' NOT NULL,
	"status" "booking_status" DEFAULT 'PENDING' NOT NULL,
	"paymentStatus" "payment_status" DEFAULT 'PENDING' NOT NULL,
	"guestName" text,
	"guestEmail" text,
	"specialRequests" text,
	"createdAt" timestamp DEFAULT now() NOT NULL,
	"updatedAt" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "booking" ADD CONSTRAINT "booking_userId_user_id_fk" FOREIGN KEY ("userId") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "booking" ADD CONSTRAINT "booking_hotelId_hotel_id_fk" FOREIGN KEY ("hotelId") REFERENCES "public"."hotel"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "booking" ADD CONSTRAINT "booking_roomId_room_id_fk" FOREIGN KEY ("roomId") REFERENCES "public"."room"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "booking_user_idx" ON "booking" USING btree ("userId");--> statement-breakpoint
CREATE INDEX "booking_hotel_idx" ON "booking" USING btree ("hotelId");--> statement-breakpoint
CREATE INDEX "booking_room_idx" ON "booking" USING btree ("roomId");--> statement-breakpoint
CREATE INDEX "booking_check_in_idx" ON "booking" USING btree ("checkIn");