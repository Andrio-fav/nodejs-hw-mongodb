import createHttpError from "http-errors";
import jwt from "jsonwebtoken";

import {
  registerUser,
  loginUser,
  logoutUser,
  refreshSession,
} from "../services/auth.js";

import User from "../db/models/user.js";
import { sendMail } from "../utils/sendMail.js";
import { getEnvVar } from "../utils/getEnvVar.js";

const THIRTY_DAYS = 30 * 24 * 60 * 60 * 1000;

export const registerController = async (req, res, next) => {
  try {
    const user = await registerUser(req.body);
    const { password, _id, ...rest } = user.toObject();

    res.status(201).json({
      status: 201,
      message: "Successfully registered a user!",
      data: { userId: _id, ...rest },
    });
  } catch (error) {
    next(error);
  }
};

export const loginController = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const { user, accessToken, refreshToken } = await loginUser(
      email,
      password
    );

    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: true,
      sameSite: "strict",
      maxAge: THIRTY_DAYS,
    });

    res.status(200).json({
      status: 200,
      message: "Successfully logged in a user!",
      data: { user, accessToken },
    });
  } catch (error) {
    next(error);
  }
};

export const refreshController = async (req, res, next) => {
  try {
    const { refreshToken } = req.cookies;
    if (!refreshToken) {
      throw createHttpError(401, "No refresh token provided");
    }

    const newSession = await refreshSession(refreshToken);

    res.cookie("refreshToken", newSession.refreshToken, {
      httpOnly: true,
      secure: true,
      sameSite: "strict",
      maxAge: THIRTY_DAYS,
    });

    res.status(200).json({
      status: 200,
      message: "Successfully refreshed a session!",
      data: { accessToken: newSession.accessToken },
    });
  } catch (error) {
    next(error);
  }
};

export const logoutController = async (req, res, next) => {
  try {
    const { sessionId } = req.body;
    await logoutUser(sessionId);
    res.clearCookie("refreshToken");
    res.status(204).send();
  } catch (error) {
    next(error);
  }
};

export const sendResetEmailController = async (req, res, next) => {
  try {
    const { email } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      throw createHttpError(404, "User not found!");
    }

    const token = jwt.sign({ email }, getEnvVar("JWT_SECRET"), {
      expiresIn: "5m",
    });

    const resetLink = `${getEnvVar("APP_DOMAIN")}/reset-password?token=${token}`;

    const mail = {
      to: email,
      subject: "Password Reset Request",
      html: `
        <p>Hello ${user.name || "User"},</p>
        <p>You requested to reset your password. Click the link below (valid for 5 minutes):</p>
        <a href="${resetLink}">${resetLink}</a>
        <p>If you did not request this, please ignore this email.</p>
      `,
    };

    await sendMail(mail);

    res.status(200).json({
      status: 200,
      message: "Reset password email has been successfully sent.",
      data: {},
    });
  } catch (error) {
    next(error);
  }
};