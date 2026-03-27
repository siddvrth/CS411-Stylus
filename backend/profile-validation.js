import { buildDefaultProfile } from "./profile-service.js";

function isPlainObject(value) {
  return value !== null && typeof value === "object" && !Array.isArray(value);
}

function normalizeText(value) {
  if (typeof value !== "string") {
    return "";
  }

  return value.trim();
}

function normalizeStringList(value) {
  if (!Array.isArray(value)) {
    return [];
  }

  return value
    .filter((entry) => typeof entry === "string")
    .map((entry) => entry.trim())
    .filter(Boolean);
}

function normalizeBudget(value, fieldName, fieldErrors) {
  if (value === null || value === undefined || value === "") {
    return null;
  }

  if (typeof value !== "number" || Number.isNaN(value)) {
    fieldErrors[fieldName] = "Enter a valid number.";
    return null;
  }

  if (value < 0) {
    fieldErrors[fieldName] = "Budget must be zero or greater.";
    return null;
  }

  return value;
}

export function validateCreateProfileRequest(payload) {
  if (!isPlainObject(payload)) {
    return {
      ok: false,
      message: "Request body must be a JSON object.",
      fieldErrors: {},
    };
  }

  const isSkipped = payload.isSkipped === true;

  if (isSkipped) {
    return {
      ok: true,
      value: {
        profile: buildDefaultProfile(),
        createdWith: "default",
      },
    };
  }

  const fieldErrors = {};
  const preferredSize = normalizeText(payload.preferredSize);
  const fitPreference = normalizeText(payload.fitPreference);
  const budgetMin = normalizeBudget(payload.budgetMin, "budgetMin", fieldErrors);
  const budgetMax = normalizeBudget(payload.budgetMax, "budgetMax", fieldErrors);

  if (!preferredSize) {
    fieldErrors.preferredSize = "Preferred size is required.";
  }

  if (!fitPreference) {
    fieldErrors.fitPreference = "Fit preference is required.";
  }

  if (budgetMin !== null && budgetMax !== null && budgetMin > budgetMax) {
    fieldErrors.budgetMax = "Max budget must be greater than or equal to min budget.";
  }

  if (Object.keys(fieldErrors).length > 0) {
    return {
      ok: false,
      message: "Please correct the highlighted fields.",
      fieldErrors,
    };
  }

  return {
    ok: true,
    value: {
      profile: {
        preferredSize,
        fitPreference,
        styleTags: normalizeStringList(payload.styleTags),
        favoriteBrands: normalizeStringList(payload.favoriteBrands),
        budgetMin,
        budgetMax,
      },
      createdWith: "submitted",
    },
  };
}

