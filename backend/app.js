import express from "express";
import { createProfileHandler } from "./profile-controller.js";

const app = express();

app.use(express.json());

app.post("/api/profile", createProfileHandler);

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
