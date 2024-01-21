import { Router } from 'express'
import { bookmarkTweetController, unBookmarkTweetController } from '~/controllers/bookmarks.controller'
import { tweetIDValidator } from '~/middlewares/tweets.middlewares'
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
bookmarkRouter.post(
  '/',
  accessTokenValidator,
  verifiedUserValidator,
  tweetIDValidator,
  wrapRequestHandler(bookmarkTweetController)
)

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
  tweetIDValidator,
  wrapRequestHandler(unBookmarkTweetController)
)

export default bookmarkRouter
