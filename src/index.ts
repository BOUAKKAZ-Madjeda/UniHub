import * as functions from "firebase-functions";
import * as express from 'express';
import * as cors from 'cors';
import cloudinaryRoutes from './routes/cloudinary';

const app = express();

// Global middleware
app.use(cors({ origin: 'http://localhost:5173' }));
app.use(express.json());

// Mount routes
app.use('/api/cloudinary', cloudinaryRoutes);

// Export as Firebase Function
export const api = functions.https.onRequest(app);