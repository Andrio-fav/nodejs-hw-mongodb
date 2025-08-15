import createHttpError from 'http-errors';
import {
  registerUser,
  loginUser,
  logoutUser,
  refreshSession,
} from '../services/auth.js';

const THIRTY_DAYS = 30 * 24 * 60 * 60 * 1000;

export const registerController = async (req, res, next) => {
  try {
    const user = await registerUser(req.body);
    const { password, ...userData } = user.toObject();

    res.status(201).json({
      status: 201,
      message: 'Successfully registered a user!',
      data: userData,
    });
  } catch (error) {
    next(error);
  }
};

export const loginController = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const { user, accessToken, refreshToken, sessionId } = 
      await loginUser(email, password);

    res.cookie('refreshToken', refreshToken, {
      httpOnly: true,
      secure: true,
      sameSite: 'strict',
      maxAge: THIRTY_DAYS,
    });

    res.status(200).json({
      status: 200,
      message: 'Successfully logged in a user!',
      data: { user, sessionId, accessToken },
    });
  } catch (error) {
    next(error);
  }
};

export const refreshController = async (req, res, next) => {
  try {
    const { sessionId } = req.body;
    const { refreshToken } = req.cookies;

    if (!refreshToken) {
      throw createHttpError(401, 'No refresh token provided');
    }

    const newSession = await refreshSession(sessionId, refreshToken);

    res.cookie('refreshToken', newSession.refreshToken, {
      httpOnly: true,
      secure: true,
      sameSite: 'strict',
      maxAge: THIRTY_DAYS,
    });

    res.status(200).json({
      status: 200,
      message: 'Successfully refreshed a session!',
      data: {
        sessionId: newSession._id,
        accessToken: newSession.accessToken,
      },
    });
  } catch (error) {
    next(error);
  }
};

export const logoutController = async (req, res, next) => {
  try {
    const { sessionId } = req.body;
    await logoutUser(sessionId);
    res.clearCookie('refreshToken');
    res.status(204).send();
  } catch (error) {
    next(error);
  }
};