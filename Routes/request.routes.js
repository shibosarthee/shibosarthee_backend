import express from "express";
import { protect } from "../middleware/authmiddleware.js";
import { sendRequest,getReceivedRequests,getSentRequests,updateRequestStatus,cancelRequest } from "../Controllers/request.controller.js";

const router = express.Router();

router.post("/send", protect, sendRequest);
router.get("/received", protect, getReceivedRequests);
router.get("/sent", protect, getSentRequests);
router.put("/:requestId/status", protect, updateRequestStatus);
router.put("/:requestId/cancel", protect, cancelRequest);

export default router;