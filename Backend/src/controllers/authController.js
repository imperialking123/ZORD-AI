import jwt from "jsonwebtoken";
import crypto from "crypto";
import StateToken from "../model/stateTokenSchema.js";
import { googleAuthClient } from "../utils/authClients.js";
import User from "../model/userSchema.js";
import { generateJWTCookie } from "../utils/generateToken.js";
import axios from "axios";

export const handleGoogleAuth = async (req, res) => {
  try {
    const { code, state } = req.body;
    const GOOGLE_CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET;

    const token = await StateToken.findOne({ _id: state });
    if (!token)
      return res
        .status(400)
        .json({ message: "Unexpected error. Reload and retry." });

    const verify = jwt.verify(token.jwt, GOOGLE_CLIENT_SECRET);

    await token.deleteOne();

    const { tokens } = await googleAuthClient.getToken(code);

    const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID;

    const ticket = await googleAuthClient.verifyIdToken({
      idToken: tokens.id_token,
      audience: GOOGLE_CLIENT_ID,
    });

    const payload = ticket.getPayload();

    const { email, name, picture, sub } = payload;

    const findUser = await User.findOne({
      email,
    });

    if (findUser) {
      //Generate Cookie Here
      generateJWTCookie(findUser._id, res);
      return res.status(200).json(findUser);
    } else {
      const newUser = await User.create({
        email: email,
        name: name,
        profile: {
          avatar: picture,
        },
        oauth_provider: "google",
        provider_id: sub || "failed_sub",
        role: "user",
        loginType: "oauth",
      });

      generateJWTCookie(newUser._id, res);

      return res.status(200).json(newUser);
    }
  } catch (error) {
    console.error("Error on #handleGoogleAuth authController.js", error);
    if (err.name === "TokenExpiredError") {
      return res
        .status(401)
        .json({ message: "Your session has expired. Please try again." });
    } else if (err.name === "JsonWebTokenError") {
      return res
        .status(400)
        .json({ message: "Invalid request. Please refresh and try again." });
    } else if (err.name === "NotBeforeError") {
      return res.status(400).json({
        message: "This request is not active yet. Please wait and try again.",
      });
    } else {
      return res
        .status(400)
        .json({ message: "Request could not be processed. Please try again." });
    }
    return res.status(500).json({ message: "Internal Server error" });
  }
};

export const createGoogleStateToken = async (req, res) => {
  try {
    const GOOGLE_CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET;

    const hashData = {
      token: crypto.randomBytes(10).toString("hex"),
    };

    const jwtToken = jwt.sign(hashData, GOOGLE_CLIENT_SECRET, {
      expiresIn: "5min",
    });

    const newToken = await StateToken.create({
      jwt: jwtToken,
      stateCategory: "google",
    });

    return res.status(200).json(newToken._id);
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

export const handleDiscordAuth = async (req, res) => {
  try {
    const code = req.body?.code;

    if (!code)
      return res
        .status(400)
        .json({ message: "Unexpected error. Reload and retry" });

    const params = new URLSearchParams({
      client_id: process.env.DISCORD_CLIENT_ID,
      client_secret: process.env.DISCORD_CLIENT_SECRET,
      grant_type: "authorization_code",
      code,
      redirect_uri: `${process.env.FRONTEND_BASE_URL}/auth/discord`,
    });

    const headers = {
      "Content-Type": "application/x-www-form-urlencoded",
    };

    const accessTokenResponse = await axios.post(
      "https://discord.com/api/oauth2/token",
      params,
      {
        headers,
      }
    );

    const profileResponse = await axios.get(
      "https://discord.com/api/users/@me",
      {
        headers: {
          Authorization: `Bearer ${accessTokenResponse.data.access_token}`,
        },
      }
    );

    const { email, id, global_name, username, avatar } = profileResponse.data;



    const avatarUrl = avatar.startsWith("a_")
      ? `https://cdn.discordapp.com/avatars/${id}/${avatar}.gif`
      : `https://cdn.discordapp.com/avatars/${id}/${avatar}.png`;



    const conditions = [{ provider_id: profileResponse.data.id }];

    if (email) {
      conditions.push({ email: email });
    }

    const findUser = await User.findOne({ $or: conditions });

    if (findUser) {
      console.log("User logged in  with Discord Auth");
      generateJWTCookie(findUser._id, res);

      return res.status(200).json(findUser);
    } else {
      const handles = {
        provider_id: id,
        name: global_name || username,
      };

      if (email) {
        handles.email = email;
      }

      const newUser = await User.create({
        oauth_provider: "discord",
        loginType: "oauth",
        ...handles,
        role: "user",
        profile: {
          avatar: avatarUrl
        }
      });

      console.log("New user created with Discord Auth");
      generateJWTCookie(newUser.id, res);

      return res.status(200).json(newUser);
    }
  } catch (error) {
    console.error(
      "Error on #handleDiscordAuth authController.js",
      error.response?.data?.message || error.message
    );
    return res.status(500).json({ message: "Internal Server error" });
  }
};

export const handleCheckAuth = async (req, res) => {
  try {
    const user = req.user;

    console.log(`${user.name} refreshed`);

    return res.status(200).json(user);
  } catch (error) {
    console.log("Error on #handleCheckAuth authController.js", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

export const handleLookupEmail = async (req, res) => {
  try {
    const { email } = req.body || {};

    if (!email)
      return res
        .status(400)
        .json({ message: "Invalid Request. Please check input" });

    const findUser = await User.findOne({ email });

    if (findUser) {
      if (findUser.loginType === "oauth") {
        const returnArgs = {
          email: email,
          accountExists: "yes",
          loginType: findUser.loginType,
          oauth_provider: findUser.oauth_provider,
        };

        return res.status(200).json(returnArgs);
      }
    } else {
      return res.status(200).json({
        email,
        accountExists: "no",
      });
    }
  } catch (error) {
    console.log("Error on #handleLookupEmail authController.js", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

export const handleCreateGithubStateToken = async (req, res) => {
  try {
    const GITHUB_CLIENT_SECRET = process.env.GITHUB_CLIENT_SECRET;

    const hashData = {
      token: crypto.randomBytes(10).toString("hex"),
    };

    const jwtToken = jwt.sign(hashData, GITHUB_CLIENT_SECRET, {
      expiresIn: "5min",
    });

    const newToken = await StateToken.create({
      jwt: jwtToken,
      stateCategory: "github",
    });

    return res.status(200).json(newToken._id);
  } catch (error) {
    console.log(
      "Error on  #handleCreateGithubStateToken authController.js ",
      error
    );
    return res.status(500).json({ message: "Internal server error" });
  }
};

export const handleGithubAuth = async (req, res) => {
  try {
    const { code, state } = req.body || {};
    const GITHUB_CLIENT_SECRET = process.env.GITHUB_CLIENT_SECRET;
    const GITHUB_CLIENT_ID = process.env.GITHUB_CLIENT_ID;
    const REDIRECT_URL = `${process.env.FRONTEND_BASE_URL}/auth/github/callback`;

    if (!code || !state)
      return res.status(400).json({
        message: "Couldn't grab profile info from Github. Please retry",
      });

    const findToken = await StateToken.findOne({
      _id: state,
    });

    if (!findToken)
      return res.status(400).json({
        message: "Invalid Request. Please retry Github Login Client",
      });

    const verify = jwt.verify(findToken.jwt, GITHUB_CLIENT_SECRET);

    //first post to get accessToken from github

    const params = new URLSearchParams({
      client_id: GITHUB_CLIENT_ID,
      client_secret: GITHUB_CLIENT_SECRET,
      code: code,
      redirect_uri: REDIRECT_URL,
    }).toString();

    const accessTokenRes = await axios.post(
      `https://github.com/login/oauth/access_token`,
      params,

      {
        headers: {
          Accept: "application/json",
          "Content-Type": "application/x-www-form-urlencoded",
        },
      }
    );

    //second get to get profile data from github
    const getProfileData = await axios.get("https://api.github.com/user", {
      headers: {
        Authorization: `token ${accessTokenRes.data.access_token}`,
        "User-Agent": "ZORD",
      },
    });

    const { name, email, avatar_url, id, login } = getProfileData.data;

    const conditions = [{ provider_id: id }];

    if (email) {
      conditions.push({ email: email });
    }

    const findUser = await User.findOne({ $or: conditions });

    if (findUser) {
      generateJWTCookie(findUser._id, res);
      return res.status(200).json(findUser);
    } else {
      const handles = {
        provider_id: id,
      };

      if (email) {
        handles.email = email;
      }
      const newUser = await User.create({
        name: name || login,
        role: "user",
        oauth_provider: "github",
        profile: {
          avatar: avatar_url,
        },
        ...handles,
        loginType: "oauth",
      });

      generateJWTCookie(newUser._id, res);

      return res.status(200).json(newUser);
    }
  } catch (error) {
    console.log("Error on #handleGithubAuth authController.js", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};
