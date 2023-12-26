import express from 'express'
import {
  ResendVerifyEmailController,
  verifyEmailController,
  loginController,
  logoutController,
  registerController,
  forgotPasswordController,
  verifyForgotPasswordController,
  resetPasswordController,
  getMeController,
  updateMeController
} from '~/controllers/users.controller'
import {
  accessTokenValidator,
  emailVerifyTokenValidator,
  forgotPasswordValidator,
  loginValidator,
  refreshTokenValidator,
  registerValidator,
  resetPasswordValidator,
  updateMeValidator,
  verifiedUserValidator,
  verifyForgotPasswordTokenValidator
} from '~/middlewares/users.middlewares'
import { wrapRequestHandler } from '~/utils/handlers'

const usersRouter = express.Router()

/**
 * Description: login a new user
 * Path: /login
 * method: POST
 * Body: { email: string, password: string}
 */

usersRouter.post('/login', loginValidator, wrapRequestHandler(loginController))

/**
 * Description: Register a new user
 * Path: /register
 * method: POST
 * Body: {
 * email: string, password: string, date_of_birth: ISO8601, confirm_password: string }
 */

usersRouter.post('/register', registerValidator, wrapRequestHandler(registerController))

/**
 * Description: logout a new user
 * Path: /logout
 * method: POST
 * header: {Authorization: Bearer <access_token>}
 * Body: { refresh_token: string}
 */
usersRouter.post('/logout', accessTokenValidator, refreshTokenValidator, wrapRequestHandler(logoutController))

/**
 * Description: verify email when user clicked on the link send in email
 * Path: /resend-verify-email
 * method: POST
 * Headers: {Authorization: Bearer <access_token>}
 * Body: { email_verify_token: string}
 */
usersRouter.post('/verify-email', emailVerifyTokenValidator, wrapRequestHandler(verifyEmailController))

/**
 * Description: verify email when user clicked on the link send in email
 * Path: /resend-verify-email
 * method: POST
 * Headers: {Authorization: Bearer <access_token>}
 * Body: { email_verify_token: string}
 */
usersRouter.post('/resend-verify-email', accessTokenValidator, wrapRequestHandler(ResendVerifyEmailController))

/**
 * Description: submit email to reset password, send email to user
 * Path: /forgot password
 * method: POST
 * Body: { email: string}
 */
usersRouter.post('/forgot-password', forgotPasswordValidator, wrapRequestHandler(forgotPasswordController))

/**
 * Description: verify link in email to reset password
 * Path: /verify forgot password
 * method: POST
 * Body: { forgot_password_token}
 */
usersRouter.post(
  '/verify-forgot-password',
  verifyForgotPasswordTokenValidator,
  wrapRequestHandler(verifyForgotPasswordController)
)

/**
 * Description: verify link in email to reset password
 * Path: /verify reset password
 * method: POST
 * Body: { forgot_password_token: string, password: string, confirm_password: string}
 */
usersRouter.post('/reset-password', resetPasswordValidator, wrapRequestHandler(resetPasswordController))

/**
 * Description: get my profile
 * Path: /me
 * method: GET
 * Headers: {Authorization: Bearer <access_token>}
 * Body: {}
 */
usersRouter.get('/me', accessTokenValidator, wrapRequestHandler(getMeController))

/**
 * Description: update my profile
 * Path: /me
 * method: PATCH
 * Headers: {Authorization: Bearer <access_token>}
 * Body: UserSchema
 */
usersRouter.patch(
  '/me',
  accessTokenValidator,
  verifiedUserValidator,
  updateMeValidator,
  wrapRequestHandler(updateMeController)
)

export default usersRouter
