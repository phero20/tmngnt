CREATE TABLE "account" (
	"id" text PRIMARY KEY NOT NULL,
	"accountId" text NOT NULL,
	"providerId" text NOT NULL,
	"userId" text NOT NULL,
	"accessToken" text,
	"refreshToken" text,
	"idToken" text,
	"accessTokenExpiresAt" timestamp,
	"refreshTokenExpiresAt" timestamp,
	"scope" text,
	"password" text,
	"createdAt" timestamp NOT NULL,
	"updatedAt" timestamp NOT NULL
);
--> statement-breakpoint
CREATE TABLE "session" (
	"id" text PRIMARY KEY NOT NULL,
	"expiresAt" timestamp NOT NULL,
	"token" text NOT NULL,
	"createdAt" timestamp NOT NULL,
	"updatedAt" timestamp NOT NULL,
	"ipAddress" text,
	"userAgent" text,
	"userId" text NOT NULL,
	CONSTRAINT "session_token_unique" UNIQUE("token")
);
--> statement-breakpoint
CREATE TABLE "user" (
	"id" text PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"email" text NOT NULL,
	"emailVerified" boolean NOT NULL,
	"image" text,
	"createdAt" timestamp NOT NULL,
	"updatedAt" timestamp NOT NULL,
	"role" text,
	"banned" boolean,
	"banReason" text,
	"banExpires" timestamp,
	CONSTRAINT "user_email_unique" UNIQUE("email")
);
--> statement-breakpoint
CREATE TABLE "verification" (
	"id" text PRIMARY KEY NOT NULL,
	"identifier" text NOT NULL,
	"value" text NOT NULL,
	"expiresAt" timestamp NOT NULL,
	"createdAt" timestamp,
	"updatedAt" timestamp
);
--> statement-breakpoint
CREATE TABLE "amenity" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" text NOT NULL,
	"icon" text,
	"category" text DEFAULT 'GENERAL',
	CONSTRAINT "amenity_name_unique" UNIQUE("name")
);
--> statement-breakpoint
CREATE TABLE "hotel" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"ownerId" text NOT NULL,
	"name" text NOT NULL,
	"slug" text NOT NULL,
	"description" text,
	"address" text NOT NULL,
	"city" text NOT NULL,
	"state" text,
	"country" text NOT NULL,
	"zipCode" text,
	"latitude" numeric(10, 7),
	"longitude" numeric(10, 7),
	"contactPhone" text,
	"contactEmail" text,
	"checkInTime" text DEFAULT '14:00',
	"checkOutTime" text DEFAULT '11:00',
	"isActive" boolean DEFAULT true NOT NULL,
	"starRating" integer DEFAULT 0,
	"createdAt" timestamp DEFAULT now() NOT NULL,
	"updatedAt" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "hotel_slug_unique" UNIQUE("slug")
);
--> statement-breakpoint
CREATE TABLE "hotel_amenity" (
	"hotelId" uuid NOT NULL,
	"amenityId" uuid NOT NULL,
	CONSTRAINT "hotel_amenity_hotelId_amenityId_pk" PRIMARY KEY("hotelId","amenityId")
);
--> statement-breakpoint
CREATE TABLE "hotel_image" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"hotelId" uuid NOT NULL,
	"roomId" uuid,
	"url" text NOT NULL,
	"altText" text,
	"isPrimary" boolean DEFAULT false,
	"order" integer DEFAULT 0,
	"createdAt" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "room" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"hotelId" uuid NOT NULL,
	"name" text NOT NULL,
	"description" text,
	"price" numeric(10, 2) NOT NULL,
	"capacityAdults" integer DEFAULT 2 NOT NULL,
	"capacityChildren" integer DEFAULT 0 NOT NULL,
	"quantity" integer DEFAULT 1 NOT NULL,
	"sizeSqFt" integer,
	"isActive" boolean DEFAULT true NOT NULL,
	"createdAt" timestamp DEFAULT now() NOT NULL,
	"updatedAt" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "room_amenity" (
	"roomId" uuid NOT NULL,
	"amenityId" uuid NOT NULL,
	CONSTRAINT "room_amenity_roomId_amenityId_pk" PRIMARY KEY("roomId","amenityId")
);
--> statement-breakpoint
CREATE TABLE "room_inventory" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"roomId" uuid NOT NULL,
	"date" date NOT NULL,
	"totalRooms" integer NOT NULL,
	"bookedCount" integer DEFAULT 0 NOT NULL
);
--> statement-breakpoint
ALTER TABLE "account" ADD CONSTRAINT "account_userId_user_id_fk" FOREIGN KEY ("userId") REFERENCES "public"."user"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "session" ADD CONSTRAINT "session_userId_user_id_fk" FOREIGN KEY ("userId") REFERENCES "public"."user"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "hotel" ADD CONSTRAINT "hotel_ownerId_user_id_fk" FOREIGN KEY ("ownerId") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "hotel_amenity" ADD CONSTRAINT "hotel_amenity_hotelId_hotel_id_fk" FOREIGN KEY ("hotelId") REFERENCES "public"."hotel"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "hotel_amenity" ADD CONSTRAINT "hotel_amenity_amenityId_amenity_id_fk" FOREIGN KEY ("amenityId") REFERENCES "public"."amenity"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "hotel_image" ADD CONSTRAINT "hotel_image_hotelId_hotel_id_fk" FOREIGN KEY ("hotelId") REFERENCES "public"."hotel"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "hotel_image" ADD CONSTRAINT "hotel_image_roomId_room_id_fk" FOREIGN KEY ("roomId") REFERENCES "public"."room"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "room" ADD CONSTRAINT "room_hotelId_hotel_id_fk" FOREIGN KEY ("hotelId") REFERENCES "public"."hotel"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "room_amenity" ADD CONSTRAINT "room_amenity_roomId_room_id_fk" FOREIGN KEY ("roomId") REFERENCES "public"."room"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "room_amenity" ADD CONSTRAINT "room_amenity_amenityId_amenity_id_fk" FOREIGN KEY ("amenityId") REFERENCES "public"."amenity"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "room_inventory" ADD CONSTRAINT "room_inventory_roomId_room_id_fk" FOREIGN KEY ("roomId") REFERENCES "public"."room"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "hotel_city_idx" ON "hotel" USING btree ("city");--> statement-breakpoint
CREATE UNIQUE INDEX "hotel_slug_idx" ON "hotel" USING btree ("slug");--> statement-breakpoint
CREATE INDEX "hotel_owner_idx" ON "hotel" USING btree ("ownerId");--> statement-breakpoint
CREATE INDEX "image_hotel_idx" ON "hotel_image" USING btree ("hotelId");--> statement-breakpoint
CREATE INDEX "room_hotel_idx" ON "room" USING btree ("hotelId");--> statement-breakpoint
CREATE UNIQUE INDEX "room_inventory_date_idx" ON "room_inventory" USING btree ("roomId","date");