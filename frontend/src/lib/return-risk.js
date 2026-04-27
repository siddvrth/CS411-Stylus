const lo = (v, d) => String(v ?? d ?? "")
  .trim()
  .toLowerCase() || d;

export function normalizeFeatures(apiResponse) {
  return {
    category: lo(apiResponse?.category, "unknown"),
    style: lo(apiResponse?.style, "casual"),
    material: lo(apiResponse?.material, "unknown"),
  };
}

export function normalizeGeminiAnalysis(raw) {
  const itemFeatures = normalizeFeatures(raw);
  let score = Number(raw?.score);
  if (!Number.isFinite(score)) score = 0.5;
  score = Math.min(1, Math.max(0, score));
  const label = score < 0.38 ? "Low" : score < 0.64 ? "Medium" : "High";
  let reasons = Array.isArray(raw?.reasons) ? raw.reasons.map(String).filter(Boolean) : [];
  reasons = reasons.map((r) => r.slice(0, 120)).slice(0, 3);
  if (!reasons.length) reasons = ["Assessment from image and your item details."];
  return { itemFeatures, score, label, reasons };
}
