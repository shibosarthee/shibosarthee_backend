import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import { connectDB } from './config/db.js';


// routes import 

import authRoute from './Routes/authRoutes.js'
import userRoute from './Routes/userRoute.js'
import profileRoute from './Routes/profileRoutes.js'
import fileRoute from './Routes/file.routes.js'
import notifcationRoute from './Routes/notificationRoutes.js'

// env config
dotenv.config();

// db connect
connectDB();

const app = express();
const PORT = process.env.PORT || 5000;


// middlewares 
app.use(cors());
app.use(express.json());

// routes
app.use('/api/auth',authRoute);
app.use('/api/users',userRoute);
app.use('/api/profiles',profileRoute)
app.use('/api/files',fileRoute);
app.use('/api/notifications',notifcationRoute);


app.get('/',(req,res)=>{
    res.send("Shibo Sartee App is Running")
})


app.listen(PORT,()=>{
     console.log(`🚀 Server running on http://localhost:${PORT}`);
})
