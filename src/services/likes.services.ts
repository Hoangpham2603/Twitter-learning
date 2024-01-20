import Bookmark from '~/models/schemas/Bookmark.schema'
import databaseService from './database.service'
import { ObjectId, WithId } from 'mongodb'
import LikeTweet from '~/models/schemas/Likes.schema'

class LikesService {
  async LikeTweet(user_id: string, tweet_id: string) {
    const result = await databaseService.Likes.findOneAndUpdate(
      { user_id: new ObjectId(user_id), tweet_id: new ObjectId(tweet_id) },
      {
        $setOnInsert: new LikeTweet({
          user_id: new ObjectId(user_id),
          tweet_id: new ObjectId(tweet_id)
        })
      },
      {
        upsert: true,
        returnDocument: 'after'
      }
    )
    return result as WithId<LikeTweet>
  }
}

const likeServices = new LikesService()

export default likeServices
