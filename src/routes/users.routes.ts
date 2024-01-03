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
  updateMeController,
  getProfileController,
  followController,
  unfollowController,
  changePasswordController,
  oauthController
} from '~/controllers/users.controller'
import { filterMiddlewares } from '~/middlewares/common.middlewares'
import {
  accessTokenValidator,
  changePasswordValidator,
  emailVerifyTokenValidator,
  followValidator,
  forgotPasswordValidator,
  loginValidator,
  refreshTokenValidator,
  registerValidator,
  resetPasswordValidator,
  unfollowValidator,
  updateMeValidator,
  verifiedUserValidator,
  verifyForgotPasswordTokenValidator
} from '~/middlewares/users.middlewares'
import { UpdateMeReqBody } from '~/models/requests/User.request'
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
 * Description: OAuth with Google
 * Path: /oauth/google
 * method: GET
 * Query: {query}
 */
usersRouter.get('/oauth/google', wrapRequestHandler(oauthController))

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
 * Description: get me profile
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
  filterMiddlewares<UpdateMeReqBody>([
    'name',
    'date_of_birth',
    'bio',
    'location',
    'website',
    'avatar',
    'username',
    'cover_photo'
  ]),
  wrapRequestHandler(updateMeController)
)
///^(?![0-9]+$)[A-Za-z0-9_]{4,15}$/

/**
 * Description: get user profile
 * Path: /:username
 * method: GET
 * Body: {User}
 */
usersRouter.get('/:username', wrapRequestHandler(getProfileController))

/**
 * Description: follow someone
 * POST: /follow
 * method: POST
 * Headers: {Authorization: Bearer <access_token>}
 * Body: {followed_user_id: string}
 */
usersRouter.post(
  '/follow',
  accessTokenValidator,
  verifiedUserValidator,
  followValidator,
  wrapRequestHandler(followController)
)

/**
 * Description: Unfollow someone
 * POST: /follow/user_id
 * method: DELETE
 * Headers: {Authorization: Bearer <access_token>}
 * Body: {followed_user_id: string}
 */
usersRouter.post(
  '/follow',
  accessTokenValidator,
  verifiedUserValidator,
  unfollowValidator,
  wrapRequestHandler(unfollowController)
)

/**
 * Description: Change password
 * POST: /change-password
 * method: PUT
 * Headers: {Authorization: Bearer <access_token>}
 * Body: {old_password: string, password:string, confirm_password: string}
 */
usersRouter.put(
  '/change-password',
  accessTokenValidator,
  verifiedUserValidator,
  changePasswordValidator,
  wrapRequestHandler(changePasswordController)
)
export default usersRouter
