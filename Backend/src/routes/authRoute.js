import { Router } from "express";
import {
  createGoogleStateToken,
  handleCheckAuth,
  handleCreateGithubStateToken,
  handleDiscordAuth,
  handleGithubAuth,
  handleGoogleAuth,
  handleLookupEmail,
} from "../controllers/authController.js";
import protectRoute from "../middleware/protectRoute.js";

const authRoute = Router();

authRoute.get("/check", protectRoute, handleCheckAuth);
authRoute.post("/lookup-email", handleLookupEmail);
authRoute.post("/google", handleGoogleAuth);
authRoute.get("/google/createToken", createGoogleStateToken);
authRoute.post("/discord", handleDiscordAuth);

authRoute.get("/github/createToken", handleCreateGithubStateToken);
authRoute.post("/github", handleGithubAuth)

export default authRoute;
