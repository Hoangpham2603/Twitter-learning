import { Router } from 'express'
import { createTweetController, getTweetChildrenController, getTweetController } from '~/controllers/tweets.controller'
import {
  audienceValidator,
  createtweetValidator,
  getTweetChildrenValidator,
  tweetIDValidator
} from '~/middlewares/tweets.middlewares'
import { accessTokenValidator, isUserLoggedInValidator, verifiedUserValidator } from '~/middlewares/users.middlewares'
import { wrapRequestHandler } from '~/utils/handlers'

const tweetsRouter = Router()

/**
 * Description: create tweet
 * Path: /
 * Methos: POST
 * Body: {TweetRequestBody}
 * Header: {Authorization: Bearer<access_token>}
 *
 */
tweetsRouter.post(
  '/',
  accessTokenValidator,
  verifiedUserValidator,
  createtweetValidator,
  wrapRequestHandler(createTweetController)
)

/**
 * Description: get tweet detail
 * Path: /:tweet_id
 * Methos: GET
 * Header: {Authorization: Bearer<access_token>}
 *
 */
tweetsRouter.get(
  '/:tweet_id',
  tweetIDValidator,
  isUserLoggedInValidator(accessTokenValidator),
  isUserLoggedInValidator(verifiedUserValidator),
  audienceValidator,
  wrapRequestHandler(getTweetController)
)

/**
 * Description: get tweet Children
 * Path: /:tweet_id/children
 * Methos: GET
 * Header: {Authorization: Bearer<access_token>}
 * Query: {limit: number, page: number, tweet_type: TweetType}
 *
 */
tweetsRouter.get(
  '/:tweet_id/children',
  tweetIDValidator,
  getTweetChildrenValidator,
  isUserLoggedInValidator(accessTokenValidator),
  isUserLoggedInValidator(verifiedUserValidator),
  audienceValidator,
  wrapRequestHandler(getTweetChildrenController)
)

export default tweetsRouter
