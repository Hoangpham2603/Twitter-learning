import { Router } from 'express'
import {
  createTweetController,
  getNewFeedController,
  getTweetChildrenController,
  getTweetController
} from '~/controllers/tweets.controller'
import {
  audienceValidator,
  createTweetValidator,
  getTweetChildrenValidator,
  paginationValidator,
  tweetIDValidator
} from '~/middlewares/tweets.middlewares'
import { accessTokenValidator, isUserLoggedInValidator, verifiedUserValidator } from '~/middlewares/users.middlewares'
import { wrapRequestHandler } from '~/utils/handlers'

const tweetsRouter = Router()

/**
 * Description: create tweet
 * Path: /
 * Method: POST
 * Body: {TweetRequestBody}
 * Header: {Authorization: Bearer<access_token>}
 *
 */
tweetsRouter.post(
  '/',
  accessTokenValidator,
  verifiedUserValidator,
  createTweetValidator,
  wrapRequestHandler(createTweetController)
)

/**
 * Description: get tweet detail
 * Path: /:tweet_id
 * Method: GET
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
 * Method: GET
 * Header: {Authorization: Bearer<access_token>}
 * Query: {limit: number, page: number, tweet_type: TweetType}
 *
 */
tweetsRouter.get(
  '/:tweet_id/children',
  tweetIDValidator,
  paginationValidator,
  getTweetChildrenValidator,
  isUserLoggedInValidator(accessTokenValidator),
  isUserLoggedInValidator(verifiedUserValidator),
  audienceValidator,
  wrapRequestHandler(getTweetChildrenController)
)

/**
 * Description: get new feed
 * Path: /
 * Method: GET
 * Header: {Authorization: Bearer<access_token>}
 * Query: {limit: number, page: number}
 *
 */
tweetsRouter.get(
  '/',
  paginationValidator,
  accessTokenValidator,
  verifiedUserValidator,
  audienceValidator,
  wrapRequestHandler(getNewFeedController)
)

export default tweetsRouter
