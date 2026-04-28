export function validateFeedbackRequest(payload) {
  if (!payload || !payload.sessionId) {
    return { ok: false, message: "sessionId is required" };
  }

  const validFeedbackOptions = ["Likely Keep", "Return", "Not Sure"];
  if (payload.feedback && !validFeedbackOptions.includes(payload.feedback)) {
    return { ok: false, message: "Feedback must be one of: " + validFeedbackOptions.join(", ") };
  }

  return { ok: true, value: payload };
}