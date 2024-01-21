import { Router } from 'express'
import { bookmarkTweetController, unBookmarkTweetController } from '~/controllers/bookmarks.controller'
import { UnLikesTweetController, likesTweetController } from '~/controllers/likeTweets.controller'
import { tweetIDValidator } from '~/middlewares/tweets.middlewares'
import { accessTokenValidator, verifiedUserValidator } from '~/middlewares/users.middlewares'
import { wrapRequestHandler } from '~/utils/handlers'

const likesRouter = Router()

/**
 * Description: Like Tweet
 * Path: /
 * Methos: POST
 * Body: {tweet_id}
 * Header: {Authorization: Bearer<access_token>}
 *
 */
likesRouter.post(
  '/',
  accessTokenValidator,
  verifiedUserValidator,
  tweetIDValidator,
  wrapRequestHandler(likesTweetController)
)

/**
 * Description: UnLike Tweet
 * Path: /tweets/:tweet_id
 * Methos: DELETE
 * Header: {Authorization: Bearer<access_token>}
 *
 */
likesRouter.delete(
  '/tweets/:tweet_id',
  accessTokenValidator,
  verifiedUserValidator,
  tweetIDValidator,
  wrapRequestHandler(UnLikesTweetController)
)

export default likesRouter
