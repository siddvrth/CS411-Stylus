import express from "express";
import { createProfileHandler, getProfileHandler } from "./profile-controller.js";
import {uploadItemHandler, confirmItemHandler, predictReturnRiskHandler} from "./item-controller.js";
import { saveFeedbackHandler } from "./feedback-controller.js";

const app = express();

app.use(express.json());
app.get("/api/profile", getProfileHandler);
app.post("/api/profile", createProfileHandler);
app.post("/api/item/upload", uploadItemHandler);
app.post("/api/item/confirm", confirmItemHandler);
app.post("/api/item/predict", predictReturnRiskHandler);
app.post("/api/item/feedback", saveFeedbackHandler);

app.use((error, req, res, next) => {
  if (error instanceof SyntaxError && "body" in error) {
    return res.status(400).json({
      message: "Request body must be valid JSON.",
      fieldErrors: {},
    });
  }

  return next(error);
});

export default app;
