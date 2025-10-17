import express from "express";
import { sendTestNotification } from "../Controllers/notificationController.js";

const router = express.Router();


router.post('/send',sendTestNotification);

export default router;