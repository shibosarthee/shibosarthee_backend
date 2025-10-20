import express from 'express';
import { createProfile,getMyProfiles,getAllActiveProfiles,getProfileById,detailsgetProfileById,updateProfile,deleteProfile, deleteGalleryPhoto, uploadProfileImage, uploadGalleryPhotos, getSuggestedProfiles } from '../Controllers/profile.controller.js';
import { protect } from '../middleware/authmiddleware.js';
import { uploadMultiple, uploadSingle } from '../middleware/upload.middleware.js';

const router = express.Router();

// Logged-in user profile management
router.post("/", protect, createProfile);               // create profile
router.get("/my", protect, getMyProfiles);              // get my profiles
router.get("/:id", protect, getProfileById);            // get one profile
router.get("/suggestion/:id", getSuggestedProfiles);            // get one profile
router.get("/details/:id", protect, detailsgetProfileById);            // get one profile
router.put("/:id", protect, updateProfile);             // update
router.delete("/:id", protect, deleteProfile);          // delete


// Image upload
router.post("/:id/profile-image", protect, uploadSingle, uploadProfileImage);
router.post("/:id/gallery-photos", protect, uploadMultiple, uploadGalleryPhotos);
router.delete("/:id/gallery-photo", protect, deleteGalleryPhoto);


// Publicly available profiles (e.g. browse matches)
router.get("/", protect, getAllActiveProfiles);


export default router;