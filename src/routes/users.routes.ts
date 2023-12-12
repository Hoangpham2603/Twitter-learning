import express from 'express'
import { loginController, registerController } from '~/controllers/users.controller'
import { loginValidator, registerValidator } from '~/middlewares/users.middlewares'

const usersRouter = express.Router()

usersRouter.post('/login', loginValidator, loginController)

/**
 * Description: Register a new user
 * Path: /register
 * method: POST
 * Body: {
 * email: string, password: string, date_of_birth: ISO8601, confirm_password: string }
 */

usersRouter.post('/register', registerValidator, registerController)

export default usersRouter
