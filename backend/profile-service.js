const profiles = new Map();

let nextProfileId = 1;

export function buildDefaultProfile() {
  return {
    preferredSize: "",
    fitPreference: "",
    styleTags: [],
    favoriteBrands: [],
    budgetMin: null,
    budgetMax: null,
  };
}

export function createProfile({ profile, createdWith }) {
  const profileId = `profile-${nextProfileId}`;

  nextProfileId += 1;

  profiles.set(profileId, {
    profileId,
    profile,
    createdAt: new Date().toISOString(),
    createdWith,
  });

  return {
    profileId,
    profile,
    createdWith,
  };
}

export function resetProfileStore() {
  profiles.clear();
  nextProfileId = 1;
}

