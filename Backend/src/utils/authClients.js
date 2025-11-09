import { OAuth2Client } from "google-auth-library";
import { config } from "dotenv";

config();
const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID;
const GOOGLE_CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET;
const redirect_uri = `${process.env.FRONTEND_BASE_URL}/auth/google`;

export const googleAuthClient = new OAuth2Client({
  client_id: GOOGLE_CLIENT_ID,
  client_secret: GOOGLE_CLIENT_SECRET,
  redirectUri: redirect_uri,
});
