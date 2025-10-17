import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import { connectDB } from './config/db.js';

// Routes import
import authRoute from './Routes/authRoutes.js';
import userRoute from './Routes/userRoute.js';
import profileRoute from './Routes/profileRoutes.js';
import fileRoute from './Routes/file.routes.js';
import notifcationRoute from './Routes/notificationRoutes.js';
import firebaseRoute from './Routes/firebaseRoutes.js';
import requestRoute from './Routes/request.routes.js';

// env config
dotenv.config();

// db connect
connectDB();

const app = express();
const PORT = process.env.PORT || 5000;

// ✅ CORS configuration
const allowedOrigins = [
  'http://localhost:5173', // Vite React
  'http://127.0.0.1:5173', // Sometimes Vite runs here
  'exp://127.0.0.1:19000', // React Native Expo (dev)
  'http://localhost:19006', // React Native Web preview (optional)
];

app.use(
  cors({
    origin: function (origin, callback) {
      // Allow requests with no origin (like mobile apps)
      if (!origin) return callback(null, true);
      if (allowedOrigins.includes(origin)) {
        return callback(null, true);
      } else {
        return callback(new Error('Not allowed by CORS'));
      }
    },
    credentials: true, // Allow cookies/auth headers
  })
);

app.use(express.json());

// routes
app.use('/api/auth', authRoute);
app.use('/api/users', userRoute);
app.use('/api/profiles', profileRoute);
app.use('/api/files', fileRoute);
app.use('/api/notifications', notifcationRoute);
app.use('/api/firebase', firebaseRoute);
app.use('/api/request',requestRoute)

app.get('/', (req, res) => {
  res.send('Shibo Sartee App is Running');
});

app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});
