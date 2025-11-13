import express from 'express';
import { testFirebase, updateFcmToken } from "../Controllers/firebaseController.js";
import { protect } from '../middleware/authmiddleware.js';

const router = express.Router();

// Firebase test route
router.get("/test", testFirebase);  

router.post('/update-fcm-token',protect,updateFcmToken)

export default router;
