import Profile from "../Models/Profilemodel.js";
import {
  createProfileSchema,
  updateProfileSchema,
} from "../validations/profile.validation.js";
import {
  uploadImageToCloudinary,
  deleteImageFromCloudinary,
} from "../services/file.service.js";

/**
 * @desc Create new marriage profile
 */
export const createProfile = async (req, res) => {
  try {
    // const { error } = createProfileSchema.validate(req.body);
    // if (error)
    //   return res.status(400).json({ message: error.details[0].message });

    const profile = await Profile.create({
      ...req.body,
      user: req.user._id, // attach current logged-in user
    });

    res.status(201).json({ message: "Profile created successfully", profile });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

/**
 * @desc Get all profiles for logged-in user
 */
export const getMyProfiles = async (req, res) => {
  try {
    const profiles = await Profile.find({ user: req.user._id });
    res.json(profiles);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

/**
 * @desc Get single profile by ID
 */
export const getProfileById = async (req, res) => {
  try {
    const profile = await Profile.findOne({
      _id: req.params.id,
      user: req.user._id,
    });

    if (!profile) return res.status(404).json({ message: "Profile not found" });
    res.json(profile);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

/**
 * @desc Update profile
 */
export const updateProfile = async (req, res) => {
  try {
    // const { error } = updateProfileSchema.validate(req.body);
    // if (error)
    //   return res.status(400).json({ message: error.details[0].message });

    const profile = await Profile.findOneAndUpdate(
      { _id: req.params.id, user: req.user._id },
      req.body,
      { new: true }
    );

    if (!profile) return res.status(404).json({ message: "Profile not found" });

    res.json({ message: "Profile updated successfully", profile });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

/**
 * @desc Delete profile
 */
export const deleteProfile = async (req, res) => {
  try {
    const profile = await Profile.findOneAndDelete({
      _id: req.params.id,
      user: req.user._id,
    });

    if (!profile) return res.status(404).json({ message: "Profile not found" });

    res.json({ message: "Profile deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

/**
 * @desc Get all active profiles (for public match listing)
 */

export const getAllActiveProfiles = async (req, res) => {
  try {
    const {
      gender,
      religion,
      caste,
      location,
      education,
      occupation,
      maritalStatus,
      minAge,
      maxAge,
      search,
      page = 1,
      limit = 10,
    } = req.query;

    const filter = { isActive: true };

    // --- Basic filters ---
    if (gender) filter.gender = gender;
    if (religion) filter.religion = religion;
    if (caste) filter.caste = caste;
    if (maritalStatus) filter.maritalStatus = maritalStatus;
    if (education) filter.education = { $regex: education, $options: "i" };
    if (occupation) filter.occupation = { $regex: occupation, $options: "i" };
    if (location) filter.location = { $regex: location, $options: "i" };

    // --- Age filter ---
    if (minAge || maxAge) {
      const currentDate = new Date();
      filter.dateOfBirth = {};

      if (minAge) {
        const maxDOB = new Date();
        maxDOB.setFullYear(currentDate.getFullYear() - minAge);
        filter.dateOfBirth.$lte = maxDOB;
      }
      if (maxAge) {
        const minDOB = new Date();
        minDOB.setFullYear(currentDate.getFullYear() - maxAge);
        filter.dateOfBirth.$gte = minDOB;
      }
    }

    // --- Text search ---
    if (search) {
      const searchRegex = new RegExp(search, "i");
      filter.$or = [
        { fullName: searchRegex },
        { bio: searchRegex },
        { location: searchRegex },
        { occupation: searchRegex },
      ];
    }

    // --- Pagination setup ---
    const pageNumber = parseInt(page) || 1;
    const pageSize = parseInt(limit) || 10;
    const skip = (pageNumber - 1) * pageSize;

    // --- Query profiles ---
    const [profiles, total] = await Promise.all([
      Profile.find(filter)
        .populate("user", "phone name")
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(pageSize),
      Profile.countDocuments(filter),
    ]);

    res.json({
      success: true,
      count: profiles.length,
      total,
      page: pageNumber,
      totalPages: Math.ceil(total / pageSize),
      data: profiles,
    });
  } catch (err) {
    console.error("Error fetching profiles:", err);
    res.status(500).json({ success: false, message: err.message });
  }
};

// ----------------- IMAGE UPLOAD -----------------

// Upload and save single profile image
export const uploadProfileImage = async (req, res) => {
  try {
    if (!req.file)
      return res.status(400).json({ message: "No image uploaded" });

    // Upload to Cloudinary
    const result = await uploadImageToCloudinary(req.file.buffer);

    // Save to profile in DB
    const profile = await Profile.findOneAndUpdate(
      { _id: req.params.id, user: req.user._id },
      { profileImage: { url: result.secure_url, publicId: result.public_id } },
      { new: true }
    );

    if (!profile) return res.status(404).json({ message: "Profile not found" });

    res.json({
      message: "Profile image uploaded & saved successfully",
      profile,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Upload and save multiple gallery photos
export const uploadGalleryPhotos = async (req, res) => {
  try {
    if (!req.files || req.files.length === 0)
      return res.status(400).json({ message: "No photos uploaded" });

    // Upload all photos to Cloudinary
    const uploads = await Promise.all(
      req.files.map((file) => uploadImageToCloudinary(file.buffer))
    );

    // Format photo objects
    const photoObjects = uploads.map((u) => ({
      url: u.secure_url,
      publicId: u.public_id,
    }));

    // Add photos to profile
    const profile = await Profile.findOneAndUpdate(
      { _id: req.params.id, user: req.user._id },
      { $push: { photos: { $each: photoObjects } } },
      { new: true }
    );

    if (!profile) return res.status(404).json({ message: "Profile not found" });

    res.json({
      message: "Gallery photos uploaded & saved successfully",
      profile,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Delete a gallery photo
export const deleteGalleryPhoto = async (req, res) => {
  try {
    const { publicId } = req.body;
    if (!publicId)
      return res.status(400).json({ message: "publicId is required" });

    // Delete from Cloudinary
    await deleteImageFromCloudinary(publicId);

    // Remove from DB
    const profile = await Profile.findOneAndUpdate(
      { _id: req.params.id, user: req.user._id },
      { $pull: { photos: { publicId } } },
      { new: true }
    );

    if (!profile) return res.status(404).json({ message: "Profile not found" });

    res.json({
      message: "Photo deleted successfully",
      profile,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
