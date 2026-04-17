import test, { afterEach } from "node:test";
import assert from "node:assert/strict";
import { createProfileHandler } from "./profile-controller.js";
import { resetProfileStore } from "./profile-service.js";

function createMockResponse() {
  return {
    statusCode: 200,
    body: null,
    status(code) {
      this.statusCode = code;
      return this;
    },
    json(payload) {
      this.body = payload;
      return this;
    },
  };
}

afterEach(() => {
  resetProfileStore();
});

test("creates a profile when required fields are present", async () => {
  const response = createMockResponse();

  createProfileHandler(
    {
      body: {
        preferredSize: "M",
        fitPreference: "Regular",
        styleTags: ["Casual", "Minimalist"],
        favoriteBrands: ["Nike", "Uniqlo"],
        budgetMin: 20,
        budgetMax: 100,
        isSkipped: false,
      },
    },
    response,
  );

  assert.equal(response.statusCode, 201);
  assert.equal(response.body.createdWith, "submitted");
  assert.equal(response.body.profile.preferredSize, "M");
  assert.deepEqual(response.body.profile.styleTags, ["Casual", "Minimalist"]);
  assert.match(response.body.profileId, /^profile-\d+$/);
});

test("creates a default profile when onboarding is skipped", async () => {
  const response = createMockResponse();

  createProfileHandler(
    {
      body: {
        isSkipped: true,
      },
    },
    response,
  );

  assert.equal(response.statusCode, 201);
  assert.equal(response.body.createdWith, "default");
  assert.deepEqual(response.body.profile.favoriteBrands, []);
  assert.equal(response.body.profile.preferredSize, "");
});

test("rejects a profile when required fields are missing", async () => {
  const response = createMockResponse();

  createProfileHandler(
    {
      body: {
        preferredSize: "",
        fitPreference: "",
        isSkipped: false,
      },
    },
    response,
  );

  assert.equal(response.statusCode, 400);
  assert.equal(response.body.message, "Please correct the highlighted fields.");
  assert.equal(response.body.fieldErrors.preferredSize, "Preferred size is required.");
  assert.equal(response.body.fieldErrors.fitPreference, "Fit preference is required.");
});

test("rejects an invalid budget range", async () => {
  const response = createMockResponse();

  createProfileHandler(
    {
      body: {
        preferredSize: "M",
        fitPreference: "Regular",
        budgetMin: 150,
        budgetMax: 100,
        isSkipped: false,
      },
    },
    response,
  );

  assert.equal(response.statusCode, 400);
  assert.equal(response.body.fieldErrors.budgetMax, "Max budget must be greater than or equal to min budget.");
});
