import { Router } from 'express'
import { bookmarkTweetController } from '~/controllers/bookmarks.controller'
import { accessTokenValidator, verifiedUserValidator } from '~/middlewares/users.middlewares'
import { wrapRequestHandler } from '~/utils/handlers'

const bookmartRouter = Router()

/**
 * Description: Bookmart Tweet
 * Path: /
 * Methos: POST
 * Body: {tweet_id}
 * Header: {Authorization: Bearer<access_token>}
 *
 */

bookmartRouter.post('/', accessTokenValidator, verifiedUserValidator, wrapRequestHandler(bookmarkTweetController))

export default bookmartRouter
