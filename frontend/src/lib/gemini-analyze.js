import { GoogleGenAI } from "@google/genai";

function dataUrlToInline(dataUrl) {
  const m = /^data:([^;,]+);base64,(.+)$/i.exec(dataUrl.trim());
  if (!m) throw new Error("Image must be a base64 data URL.");
  return { mimeType: m[1], data: m[2] };
}

function bufferToBase64(buf) {
  const bytes = new Uint8Array(buf);
  let s = "";
  for (let i = 0; i < bytes.length; i += 8192) {
    s += String.fromCharCode.apply(null, bytes.subarray(i, i + 8192));
  }
  return btoa(s);
}

async function fileToInline(file) {
  const buf = await file.arrayBuffer();
  return { mimeType: file.type || "image/jpeg", data: bufferToBase64(buf) };
}

function parseJsonFromText(text) {
  let t = (text || "").trim();
  const fenced = /^```(?:json)?\s*([\s\S]*?)```/im.exec(t);
  if (fenced) t = fenced[1].trim();
  try {
    return JSON.parse(t);
  } catch {
    const start = t.indexOf("{");
    const end = t.lastIndexOf("}");
    if (start >= 0 && end > start) return JSON.parse(t.slice(start, end + 1));
    throw new Error("Model did not return valid JSON.");
  }
}

function buildPrompt(userProfile, itemDetails) {
  const ctx = JSON.stringify({
    user: {
      preferredSize: userProfile?.preferredSize ?? "",
      fitPreference: userProfile?.fitPreference ?? "",
    },
    itemForm: {
      category: itemDetails?.category ?? "",
      size: itemDetails?.size ?? "",
      price: itemDetails?.price ?? null,
      material: itemDetails?.material ?? "",
      color: itemDetails?.color ?? "",
      style: itemDetails?.style ?? "",
      brand: itemDetails?.brand ?? "",
    },
  });
  return `You assess return risk for one clothing purchase.

Use ONLY this JSON context and what you see in the image. Do not invent sizes, prices, or preferences not given.

Context:
${ctx}

Return ONLY valid JSON:
{
  "category": "...",
  "style": "...",
  "material": "...",
  "score": 0.0,
  "label": "Low",
  "reasons": ["...", "..."]
}

- category, style, material: from the image (plain words).
- score: number from 0 to 1 = likelihood the shopper returns this item given fit/size/price signals vs the garment you see.
- label: exactly one of Low, Medium, High. Low if score < 0.38, Medium if 0.38 <= score < 0.64, High if score >= 0.64.
- reasons: 2 or 3 short strings (under 120 chars each), grounded in the image and context.`;
}

export async function analyzeItemReturnRisk({ imageInput, userProfile, itemDetails }) {
  const key = typeof __STYLUS_GEMINI_KEY__ !== "undefined" ? __STYLUS_GEMINI_KEY__ : "";
  if (!key) throw new Error("Missing Gemini API key in environment.");

  const ai = new GoogleGenAI({ apiKey: key });
  const text = buildPrompt(userProfile, itemDetails);
  const parts =
    typeof imageInput === "string"
      ? [{ inlineData: dataUrlToInline(imageInput) }, { text }]
      : [{ inlineData: await fileToInline(imageInput) }, { text }];

  const response = await ai.models.generateContent({
    model: "gemini-3-flash-preview",
    contents: parts,
  });
  return parseJsonFromText(response.text);
}
