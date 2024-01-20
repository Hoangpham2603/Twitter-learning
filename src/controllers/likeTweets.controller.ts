import { Request, Response } from 'express'
import { ParamsDictionary } from 'express-serve-static-core'
import { BOOKMARK_MESSAGES, LIKE_MESSAGES, TWEETS_MESSAGES } from '~/constants/messages'
import { LikeTweetReqBody } from '~/models/requests/Likes.request'
import { TokenPayload } from '~/models/requests/User.request'
import bookmarkService from '~/services/bookmark.services'
import likeServices from '~/services/likes.services'

export const likesTweetController = async (req: Request<ParamsDictionary, any, LikeTweetReqBody>, res: Response) => {
  const { user_id } = req.decoded_authorization as TokenPayload
  const result = await likeServices.LikeTweet(user_id, req.body.tweet_id)
  console.log(result)
  return res.json({
    message: LIKE_MESSAGES.LIKE_SUCCESSFULLY,
    result
  })
}
