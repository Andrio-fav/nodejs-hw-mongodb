import {
  loginUser,
  logoutUser,
  refreshUserSession,
  registerUser,
  requestResetToken,
  resetAuthPassword,
} from '../services/auth.js';
import { ctrlWrapper } from '../utils/ctrlWrapper.js';

export const registerUserController = ctrlWrapper(async (request, response) => {
  const newUser = await registerUser(request.body);

  response.status(201).json({ status: 201, message: 'Successfully created a user!', data: newUser });
});

export const loginUserController = ctrlWrapper(async (request, response) => {
  const session = await loginUser(request.body);

  setupSession(response, session);

  response.status(200).json({
    status: 200,
    message: 'Successfully logged in an user!',
    data: {
      accessToken: session.accessToken,
    },
  });
});

export const refreshUserController = ctrlWrapper(async (request, response) => {
  const { sessionId, refreshToken } = request.cookies;
  const session = await refreshUserSession(sessionId, refreshToken);

  setupSession(response, session);

  response.status(200).json({
    status: 200,
    message: 'Successfully refreshed a session!',
    data: {
      accessToken: session.accessToken,
    },
  });
});

export const logoutUserController = ctrlWrapper(async (request, response) => {
  if (request.cookies.sessionId) {
    await logoutUser(request.cookies.sessionId);
  }
  response.clearCookie('sessionId');
  response.clearCookie('refreshToken');

  response.status(204).end();
});

//-----Password reset-----

export const sendResetEmailController = ctrlWrapper(async (request, response) => {
  await requestResetToken(request.body.email);

  response.json({
    message: 'Reset password email was successfully sent!',
    status: 200,
    data: {},
  });
});

export const resetAuthPasswordController = ctrlWrapper(async (request, response) => {
  await resetAuthPassword(request.body);

  response.json({
    message: 'Password has been successfully reset.',
    status: 200,
    data: {},
  });
});

//-----HELPERS-----

const setupSession = (response, session) => {
  response.cookie('refreshToken', session.refreshToken, {
    httpOnly: true,
    expires: session.refreshTokenValidUntil,
  });
  response.cookie('sessionId', session._id, {
    httpOnly: true,
    expires: session.refreshTokenValidUntil,
  });
};