import { createProfile } from "./profile-service.js";
import { validateCreateProfileRequest } from "./profile-validation.js";

export function createProfileHandler(req, res) {
  const validation = validateCreateProfileRequest(req.body);

  if (!validation.ok) {
    return res.status(400).json({
      message: validation.message,
      fieldErrors: validation.fieldErrors,
    });
  }

  const savedProfile = createProfile(validation.value);

  return res.status(201).json(savedProfile);
}

