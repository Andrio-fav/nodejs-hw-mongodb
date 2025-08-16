import { Router } from 'express';
import {
  loginController,
  logoutController,
  refreshController,
  registerController,
  sendResetEmailController,
  resetPasswordController,
} from '../controllers/auth.js';

import {
  registerUserBodyCheck,
  loginUserBodyCheck,
  requestResetPwdBodyCheck,
  resetAuthPasswordBodyCheck,
} from '../middlewares/validationBody.js';

import { ctrlWrapper } from '../utils/ctrlWrapper.js';

const router = Router();

router.post('/register', registerUserBodyCheck, ctrlWrapper(registerController));
router.post('/login', loginUserBodyCheck, ctrlWrapper(loginController));
router.post('/logout', ctrlWrapper(logoutController));
router.post('/refresh', ctrlWrapper(refreshController));
router.post('/send-reset-email', requestResetPwdBodyCheck, ctrlWrapper(sendResetEmailController));
router.post('/reset-pwd', resetAuthPasswordBodyCheck, ctrlWrapper(resetPasswordController));

export default router;