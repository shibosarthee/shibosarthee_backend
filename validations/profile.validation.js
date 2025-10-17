import Joi from 'joi';
export const createProfileSchema = Joi.object({
  fullName: Joi.string().min(2).max(50).required(),
  gender: Joi.string().valid("male", "female", "other").required(),
  dateOfBirth: Joi.date().required(),
  religion: Joi.string(),
  caste: Joi.string(),
  height: Joi.number().min(50).max(250),
  education: Joi.string(),
  occupation: Joi.string(),
  location: Joi.string(),
  bio: Joi.string().max(500),
  maritalStatus: Joi.string().valid("single", "divorced", "widowed"),
  profileImage: Joi.string().uri(),
  photos: Joi.array().items(Joi.string().uri()),
  partnerPreferences: Joi.object({
    minAge: Joi.number(),
    maxAge: Joi.number(),
    preferredCaste: Joi.string(),
    preferredLocation: Joi.string(),
  }),
});

export const updateProfileSchema = createProfileSchema.fork([], (schema) =>
  schema.optional()
);