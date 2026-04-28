import { validateFeedbackRequest } from "./feedback-validation.js";
import { saveFeedback } from "./feedback-service.js";

export function saveFeedbackHandler(req, res) {
  const validation = validateFeedbackRequest(req.body);
  if (!validation.ok) return res.status(400).json(validation);

  const { sessionId, feedback } = validation.value;

  try {
    const result = saveFeedback(sessionId, feedback);
    res.status(201).json({ success: true, savedData: result });
  } catch (err) {
    res.status(500).json({ success: false, message: "Failed to save feedback." });
  }
}
