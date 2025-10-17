import { uploadImageToCloudinary,deleteImageFromCloudinary } from "../services/file.service.js";

/**
 * @desc Upload single image
 */
export const uploadSingleImage = async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ message: "No image file uploaded" });

    const result = await uploadImageToCloudinary(req.file.buffer);
    res.status(200).json({
      message: "Image uploaded successfully",
      url: result.secure_url,
      publicId: result.public_id,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

/**
 * @desc Upload multiple images
 */
export const uploadMultipleImages = async (req, res) => {
  try {
    if (!req.files || req.files.length === 0)
      return res.status(400).json({ message: "No images uploaded" });

    const uploads = await Promise.all(
      req.files.map((file) => uploadImageToCloudinary(file.buffer))
    );

    res.status(200).json({
      message: "Images uploaded successfully",
      images: uploads.map((u) => ({ url: u.secure_url, publicId: u.public_id })),
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

/**
 * @desc Delete image by publicId
 */
export const deleteImage = async (req, res) => {
  try {
    const { publicId } = req.body;
    if (!publicId) return res.status(400).json({ message: "publicId is required" });

    const result = await deleteImageFromCloudinary(publicId);
    res.status(200).json({
      message: "Image deleted successfully",
      result,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};