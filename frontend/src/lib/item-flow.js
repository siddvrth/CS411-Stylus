const SESSION_ID_KEY = "stylus.itemSessionId";
const IMAGE_URL_KEY = "stylus.itemImageUrl";
const PREDICTION_KEY = "stylus.lastPrediction";

export function ensureItemSessionId() {
  let id = sessionStorage.getItem(SESSION_ID_KEY);
  if (!id) {
    id = crypto.randomUUID();
    sessionStorage.setItem(SESSION_ID_KEY, id);
  }
  return id;
}

export function resetItemFlow() {
  sessionStorage.removeItem(SESSION_ID_KEY);
  sessionStorage.removeItem(IMAGE_URL_KEY);
  sessionStorage.removeItem(PREDICTION_KEY);
}

export function setItemImageUrl(url) {
  sessionStorage.setItem(IMAGE_URL_KEY, url);
}

export function getItemImageUrl() {
  return sessionStorage.getItem(IMAGE_URL_KEY) || "";
}

export function setLastPrediction(data) {
  sessionStorage.setItem(PREDICTION_KEY, JSON.stringify(data));
}

export function getLastPrediction() {
  const raw = sessionStorage.getItem(PREDICTION_KEY);
  return raw ? JSON.parse(raw) : null;
}

async function postJson(path, body) {
  const res = await fetch(path, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    const err = new Error(data.message || "Request failed");
    err.fieldErrors = data.fieldErrors;
    throw err;
  }
  return data;
}

export function postItemUpload(sessionId, imageUrl) {
  return postJson("/api/item/upload", { sessionId, imageUrl });
}

export function postItemConfirm(sessionId, itemDetails) {
  return postJson("/api/item/confirm", { sessionId, itemDetails });
}

export function postItemPredict(sessionId, userProfile) {
  return postJson("/api/item/predict", { sessionId, userProfile });
}

export async function fetchLatestProfile() {
  const res = await fetch("/api/profile");
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data.message || "Complete onboarding to load your profile.");
  return data;
}
