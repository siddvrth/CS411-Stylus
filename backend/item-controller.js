import {
  storeUploadedItem,
  confirmItemDetails,
  predictReturnRisk,
  sessionStore,
} from "./item-service.js";
import {
  validateUploadRequest,
  validateConfirmRequest,
  validatePredictRequest,
} from "./item-validation.js";

export function uploadItemHandler(req, res) {
  const validation = validateUploadRequest(req.body);
  if (!validation.ok) return res.status(400).json(validation);

  const { sessionId, imageUrl } = validation.value;
  const result = storeUploadedItem(sessionId, imageUrl);
  res.status(201).json(result);
}

export function confirmItemHandler(req, res) {
  const validation = validateConfirmRequest(req.body);
  if (!validation.ok) return res.status(400).json(validation);

  const { sessionId, itemDetails } = validation.value;
  const result = confirmItemDetails(sessionId, itemDetails);
  res.status(200).json(result);
}

export function predictReturnRiskHandler(req, res) {
  const validation = validatePredictRequest(req.body);
  if (!validation.ok) return res.status(400).json(validation);

  const { sessionId, userProfile } = validation.value;
  const itemData = sessionStore[sessionId]?.itemDetails;

  if (!itemData) return res.status(400).json({ message: "Item details not found for session" });

  const prediction = predictReturnRisk(userProfile, itemData);
  res.status(200).json(prediction);
}
