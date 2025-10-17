import express from 'express';
import { testFirebase } from "../Controllers/firebaseController.js";

const router = express.Router();

// Firebase test route
router.get("/test", testFirebase);  

export default router;
