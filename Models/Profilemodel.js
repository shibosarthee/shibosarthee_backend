// import mongoose from "mongoose";

// const profileSchema = new mongoose.Schema(
//   {
//     user: {
//       type: mongoose.Schema.Types.ObjectId,
//       ref: "User",
//       required: true, // each profile belongs to a user
//     },
//     fullName: { type: String, required: true },
//     gender: { type: String, enum: ["male", "female", "other"], required: true },
//     dateOfBirth: { type: Date, required: true },
//     religion: { type: String },
//     caste: { type: String },
//     height: { type: Number }, // in cm
//     education: { type: String },
//     occupation: { type: String },
//     location: { type: String },
//     bio: { type: String, maxLength: 500 },
//     maritalStatus: {
//       type: String,
//       enum: ["single", "divorced", "widowed"],
//       default: "single",
//     },
//     // NEW: Cloudinary-based image storage
//     profileImage: {
//       url: String,
//       publicId: String,
//     },
//     photos: [
//       {
//         url: String,
//         publicId: String,
//       },
//     ],

//     partnerPreferences: {
//       minAge: { type: Number },
//       maxAge: { type: Number },
//       preferredCaste: { type: String },
//       preferredLocation: { type: String },
//     },
//     isActive: { type: Boolean, default: true }, // deactivate if needed
//   },
//   { timestamps: true }
// );

// export default mongoose.model("Profile", profileSchema);


import mongoose from "mongoose";

const profileSchema = new mongoose.Schema(
  {
    // --- User Reference ---
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true, // each profile belongs to a user
    },

    // --- Personal Details ---
    fullName: { type: String, required: true },
    gender: { type: String, enum: ["male", "female", "other"], required: true },
    dateOfBirth: { type: Date, required: true },
    maritalStatus: {
      type: String,
      enum: ["single", "divorced", "widowed"],
      default: "single",
    },
    bloodGroup: { type: String },
    
    // --- Physical Attributes ---
    height: { type: Number }, // in cm
    weight: { type: Number }, // in kg
    complexion: { type: String }, // e.g., Fair, Wheatish, Dark
    bodyType: { type: String }, // e.g., Slim, Average, Athletic, Heavy

    // --- Educational & Career Details ---
    education: { type: String },
    jobTitle: { type: String },
    companyName: { type: String },
    annualIncome: { type: Number },

    // --- Location Details ---
    city: { type: String },
    state: { type: String },
    country: { type: String },
    location: { type: String }, // optional combined field

    // --- Religious & Cultural Details ---
    religion: { type: String },
    motherTongue: { type: String },
    caste: { type: String },
    subCaste: { type: String },
    star: { type: String }, // optional
    raasi: { type: String }, // optional

    // --- Lifestyle & Habits ---
    diet: {
      type: String,
      enum: ["vegetarian", "non-vegetarian", "vegan"],
    },
    smoking: { type: String, enum: ["yes", "no"], default: "no" },
    drinking: { type: String, enum: ["yes", "no"], default: "no" },
    hobbies: [{ type: String }],

    // --- Family Details ---
    fatherName: { type: String },
    motherName: { type: String },
    numberOfBrothers: { type: Number },
    numberOfSisters: { type: Number },
    familyStatus: { type: String }, // e.g., Middle Class, Upper Middle Class, etc.
    familyOccupation: { type: String },

    // --- Other Details ---
    bio: { type: String, maxLength: 500 },
    aboutMe: { type: String },
    
    // --- Profile Images ---
    profileImage: {
      url: String,
      publicId: String,
    },
    photos: [
      {
        url: String,
        publicId: String,
      },
    ],

    // --- Partner Preferences ---
    partnerPreferences: {
      minAge: { type: Number },
      maxAge: { type: Number },
      preferredCaste: { type: String },
      preferredLocation: { type: String },
      expectations: { type: String }, // user’s expectations
    },

    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

export default mongoose.model("Profile", profileSchema);

