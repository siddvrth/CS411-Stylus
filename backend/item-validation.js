export const MAX_IMAGE_BYTES = 5 * 1024 * 1024;

function approximateDataUrlDecodeLength(imageUrl) {
  if (typeof imageUrl !== "string") return 0;
  const marker = "base64,";
  const idx = imageUrl.indexOf(marker);
  if (idx === -1) return imageUrl.length;
  const b64 = imageUrl.slice(idx + marker.length);
  const pad = b64.endsWith("==") ? 2 : b64.endsWith("=") ? 1 : 0;
  return (b64.length * 3) / 4 - pad;
}

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
  if (approximateDataUrlDecodeLength(payload.imageUrl) > MAX_IMAGE_BYTES) {
    return { ok: false, message: "Image must be 5 MB or smaller." };
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