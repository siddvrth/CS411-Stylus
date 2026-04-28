const SESSION_ID_KEY = "stylus.itemSessionId";
const IMAGE_URL_KEY = "stylus.itemImageUrl";
const PREDICTION_KEY = "stylus.lastPrediction";

function generateUUID() {
  if (typeof crypto !== "undefined" && typeof crypto.randomUUID === "function") {
    return crypto.randomUUID();
  }
  // Fallback for non-secure contexts (HTTP on LAN IP, etc.)
  return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, (c) => {
    const r = (Math.random() * 16) | 0;
    return (c === "x" ? r : (r & 0x3) | 0x8).toString(16);
  });
}

export function ensureItemSessionId() {
  let id = sessionStorage.getItem(SESSION_ID_KEY);
  if (!id) {
    id = generateUUID();
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

export function postFeedback(sessionId, feedback) {
  return postJson("/api/item/feedback", { sessionId, feedback });
}

const RISK_HISTORY_KEY = "stylus.riskHistory";

export function saveRiskHistory(entry) {
  const list = JSON.parse(localStorage.getItem(RISK_HISTORY_KEY) || "[]");
  list.push(entry);
  localStorage.setItem(RISK_HISTORY_KEY, JSON.stringify(list));
}

export function getRiskHistory() {
  return JSON.parse(localStorage.getItem(RISK_HISTORY_KEY) || "[]");
}

export function getRecentRiskHistory(n = 5) {
  const list = getRiskHistory();
  return list.slice(-n);
}

export function clearRiskHistory() {
  localStorage.removeItem(RISK_HISTORY_KEY);
}

export async function fetchLatestProfile() {
  const res = await fetch("/api/profile");
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data.message || "Complete onboarding to load your profile.");
  return data;
}
