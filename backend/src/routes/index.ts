import { OpenAPIHono } from '@hono/zod-openapi';
import authRoutes from './auth.routes';
import hotelRoutes from './hotels';

import amenityRoutes from './amenities/amenity.routes';
import bookingRoutes from './bookings';

const app = new OpenAPIHono();

app.route('/', authRoutes);
app.route('/api/hotels', hotelRoutes);
app.route('/api/amenities', amenityRoutes);
app.route('/api/bookings', bookingRoutes);

export default app;
