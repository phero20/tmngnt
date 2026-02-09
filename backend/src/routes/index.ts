import { OpenAPIHono } from '@hono/zod-openapi';
import authRoutes from './auth.routes';
import hotelRoutes from './hotels';

import amenityRoutes from './amenities/amenity.routes';

const app = new OpenAPIHono();

app.route('/', authRoutes);
app.route('/api/hotels', hotelRoutes);
app.route('/api/amenities', amenityRoutes);

export default app;
