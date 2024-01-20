import { Router } from 'express'
import { bookmarkTweetController, unBookmarkTweetController } from '~/controllers/bookmarks.controller'
import { likesTweetController } from '~/controllers/likeTweets.controller'
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
likesRouter.post('/', accessTokenValidator, verifiedUserValidator, wrapRequestHandler(likesTweetController))

export default likesRouter
