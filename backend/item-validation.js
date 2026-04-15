function normalizeText(value) {
  if (typeof value !== "string") return "";
  return value.trim();
}

function normalizeNumber(value) {
  if (typeof value !== "number" || Number.isNaN(value)) return null;
  return value;
}

export function validateUploadRequest(payload) {
  if (!payload || !payload.sessionId || !payload.imageUrl) {
    return { ok: false, message: "sessionId and imageUrl are required" };
  }
  return { ok: true, value: payload };
}

export function validateConfirmRequest(payload) {
  if (!payload || !payload.sessionId || !payload.itemDetails) {
    return { ok: false, message: "sessionId and itemDetails are required" };
  }

  const details = payload.itemDetails;
  const errors = {};

  if (!normalizeText(details.category)) errors.category = "Category required";
  if (!normalizeText(details.size)) errors.size = "Size required";
  if (details.price !== undefined && normalizeNumber(details.price) === null) {
    errors.price = "Price must be a number";
  }
  if (Object.keys(errors).length > 0) return { ok: false, fieldErrors: errors };
  return { ok: true, value: payload };
}

export function validatePredictRequest(payload) {
  if (!payload || !payload.sessionId || !payload.userProfile) {
    return { ok: false, message: "sessionId and userProfile are required" };
  }
  return { ok: true, value: payload };
}