import { Router } from 'express'
import { bookmarkTweetController, unBookmarkTweetController } from '~/controllers/bookmarks.controller'
import { accessTokenValidator, verifiedUserValidator } from '~/middlewares/users.middlewares'
import { wrapRequestHandler } from '~/utils/handlers'

const bookmarkRouter = Router()

/**
 * Description: Bookmart Tweet
 * Path: /
 * Methos: POST
 * Body: {tweet_id}
 * Header: {Authorization: Bearer<access_token>}
 *
 */
bookmarkRouter.post('/', accessTokenValidator, verifiedUserValidator, wrapRequestHandler(bookmarkTweetController))

/**
 * Description: UnBookmart Tweet
 * Path: /:tweet_id
 * Methos: DELETE
 * Header: {Authorization: Bearer<access_token>}
 *
 */
bookmarkRouter.delete(
  '/tweets/:tweet_id',
  accessTokenValidator,
  verifiedUserValidator,
  wrapRequestHandler(unBookmarkTweetController)
)

export default bookmarkRouter
