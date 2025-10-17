import multer from "multer";

const storage = multer.memoryStorage(); // keeps file in memory buffer

const fileFilter = (req, file, cb) => {
  if (file.mimetype.startsWith("image/")) cb(null, true);
  else cb(new Error("Only image files are allowed!"), false);
};

export const uploadSingle = multer({ storage, fileFilter }).single("image");
export const uploadMultiple = multer({ storage, fileFilter }).array("images", 5);
