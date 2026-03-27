import { createProfile, getLatestProfile } from "./profile-service.js";
import { validateCreateProfileRequest } from "./profile-validation.js";

export function getProfileHandler(req, res) {
  const profile = getLatestProfile();
  if (!profile) {
    return res.status(404).json({ message: "No profile found." });
  }
  return res.json(profile);
}

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

