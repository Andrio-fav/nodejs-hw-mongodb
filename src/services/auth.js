import { randomBytes } from 'crypto';
import bcrypt from 'bcrypt';
import createHttpError from 'http-errors';
import { usersCollection } from '../db/usersModel.js';
import { SessionsCollection } from '../db/sessionsModel.js';
import jwt from 'jsonwebtoken';
import { sendMail } from '../utils/sendMail.js';
import path from 'node:path';
import fs from 'node:fs/promises';
import handlebars from 'handlebars';
import {
  ACCESS_TOKEN_TTL,
  APP_DOMAIN,
  JWT_SECRET,
  JWT_TTL,
  REFRESH_TOKEN_TTL,
  SMTP_FROM,
  TEMPLATE_DIR,
} from '../constants/index.js';

export const registerUser = async (payload) => {
  const user = await usersCollection.findOne({ email: payload.email });
  if (user) throw createHttpError(409, 'Email already in use');

  const encryptedPassword = await bcrypt.hash(payload.password, 10);
  const newUser = await usersCollection.create({
    ...payload,
    password: encryptedPassword,
  });
  return newUser;
};

export const loginUser = async (payload) => {
  const user = await usersCollection.findOne({ email: payload.email });
  if (!user) throw createHttpError(401, 'Login or password is incorrect');

  const isPasswordsMatch = await bcrypt.compare(payload.password, user.password);
  if (!isPasswordsMatch) throw createHttpError(401, 'Login or password is incorrect');

  await SessionsCollection.deleteOne({ userId: user._id });

  const newSession = createSession(user._id);
  return newSession;
};

export const refreshUserSession = async (sessionId, refreshToken) => {
  const session = await SessionsCollection.findOne({
    _id: sessionId,
    refreshToken,
  });
  if (!session) throw createHttpError(401, 'Session not found');
  if (session.refreshToken !== refreshToken) throw createHttpError(401, 'Refresh token is invalid');
  if (session.refreshTokenValidUntil < Date.now()) throw createHttpError(401, 'Session token expired');

  await SessionsCollection.deleteOne({ _id: session._id });

  const newSession = createSession(session.userId);
  return newSession;
};

export const logoutUser = async (sessionId) => {
  await SessionsCollection.deleteOne({ _id: sessionId });
};

export const requestResetToken = async (email) => {
  const user = await usersCollection.findOne({ email });

  // if (!user) throw createHttpError(404, 'User not found');
  if (!user) return;

  const resetToken = jwt.sign({ sub: user._id, email }, JWT_SECRET, { expiresIn: JWT_TTL });

  const resertPwdLetterTemplatePath = path.join(TEMPLATE_DIR, 'reset-password-email.html');
  const resertPwdLetterTemplate = (await fs.readFile(resertPwdLetterTemplatePath)).toString();
  const template = handlebars.compile(resertPwdLetterTemplate);
  const letterHtml = template({
    name: user.name,
    link: `${APP_DOMAIN}/reset-password?token=${resetToken}`,
  });

  try {
    await sendMail({
      from: SMTP_FROM,
      to: email,
      subject: 'Password reset confirmation',
      html: letterHtml,
    });
  } catch (error) {
    console.error(error);
    throw createHttpError(500, 'Failed to send the email, please try again later.');
  }
};

export const resetAuthPassword = async ({ password, token }) => {
  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await usersCollection.findByIdAndUpdate(decoded.sub, { password: hashedPassword });
    if (!user) throw createHttpError(404, 'User not found');
    await SessionsCollection.findOneAndDelete({ userId: user._id });
  } catch (error) {
    if (error.name === 'TokenExpiredError' || error.name === 'TokenExpiredError')
      throw createHttpError(401, 'Token is expired or invalid.');
    throw error;
  }
};

const createSession = async (userId) => {
  const accessToken = randomBytes(30).toString('base64');
  const refreshToken = randomBytes(30).toString('base64');

  return await SessionsCollection.create({
    userId,
    accessToken,
    refreshToken,
    accessTokenValidUntil: new Date(Date.now() + ACCESS_TOKEN_TTL),
    refreshTokenValidUntil: new Date(Date.now() + REFRESH_TOKEN_TTL),
  });
};