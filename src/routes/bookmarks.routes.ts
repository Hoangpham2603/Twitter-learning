import { Router } from 'express'
import {
  bookmarkTweetController,
  unBookmarkTweetByBookmarkIDController,
  unBookmarkTweetController
} from '~/controllers/bookmarks.controller'
import { tweetIDValidator } from '~/middlewares/tweets.middlewares'
import { accessTokenValidator, verifiedUserValidator } from '~/middlewares/users.middlewares'
import { wrapRequestHandler } from '~/utils/handlers'

const bookmarkRouter = Router()

/**
 * Description: Bookmark Tweet
 * Path: /
 * Method: POST
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
 * Description: Un-Bookmark Tweet
 * Path: /tweets/:tweet_id
 * Method: DELETE
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

/**
 * Description: Un-Bookmark Tweet
 * Path: /bookmarks/:bookmark_id
 * Method: DELETE
 * Header: {Authorization: Bearer<access_token>}
 *
 */
bookmarkRouter.delete(
  '/:bookmarks_id',
  accessTokenValidator,
  verifiedUserValidator,
  tweetIDValidator,
  wrapRequestHandler(unBookmarkTweetByBookmarkIDController)
)

export default bookmarkRouter
