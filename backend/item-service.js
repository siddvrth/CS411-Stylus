export const sessionStore = {};

export function storeUploadedItem(sessionId, imageUrl) {
  if (!sessionStore[sessionId]) sessionStore[sessionId] = {};
  sessionStore[sessionId].image = imageUrl;
  return { success: true, imageUrl };
}

export function confirmItemDetails(sessionId, itemDetails) {
  if (!sessionStore[sessionId]) sessionStore[sessionId] = {};
  sessionStore[sessionId].itemDetails = itemDetails;
  return { success: true, itemDetails };
}

export function predictReturnRisk(userProfile, itemData) {
  const features = {
    color: itemData.color || "neutral",
    material: itemData.material || "unknown",
    style: itemData.style || "casual",
    price: itemData.price || 0,
    size: itemData.size || "M",
  };

  let probability = 0.3;
  if (features.material === "synthetic") probability += 0.15;
  if (features.color === "bright") probability += 0.1;
  if (features.style === "trendy") probability += 0.1;
  if (features.price > 200) probability += 0.05;
  if (userProfile.returnRate && userProfile.returnRate > 0.3) probability += 0.2;
  let confidence = 1.0;
  const missingFeatures = Object.values(features).filter(v => v === "unknown" || v === 0).length;
  confidence -= missingFeatures * 0.2;
  confidence = Math.max(0.4, confidence);
  probability = Math.min(1, probability);
  const riskLevel = probability > 0.7 ? "High" : probability > 0.4 ? "Medium" : "Low";

  const keyDrivers = [
    features.material === "synthetic" ? "Material is synthetic" : null,
    features.color === "bright" ? "Bright color may affect returns" : null,
    features.style === "trendy" ? "Trendy style may lead to returns" : null,
    features.price > 200 ? "High-priced item" : null,
    userProfile.returnRate && userProfile.returnRate > 0.3 ? "User historically returns items" : null,
  ].filter(Boolean);

  return {riskLevel, probability: +(probability * 100).toFixed(1), confidence: +(confidence * 100).toFixed(0), keyDrivers,};
}