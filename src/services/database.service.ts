import { Collection, Db, MongoClient } from 'mongodb'
import { config } from 'dotenv'
import User from '~/models/schemas/User.schema'
import RefreshToken from '~/models/schemas/RefreshToken.schema'
import Follower from '~/models/schemas/Followers.schema'
import Tweet from '~/models/schemas/Tweet.schema'
import Hashtag from '~/models/schemas/Hashtag.schema'
import Bookmark from '~/models/schemas/Bookmark.schema'
import LikeTweet from '~/models/schemas/Likes.schema'

config()

const uri = `mongodb+srv://${process.env.DB_USERNAME}:${process.env.DB_PASSWORD}@twitter-dev.anfyhm2.mongodb.net/?retryWrites=true&w=majority`

class DatabaseService {
  private client: MongoClient
  private db: Db
  constructor() {
    // Ensures that the client will close when you finish/error
    this.client = new MongoClient(uri)
    this.db = this.client.db(process.env.DB_NAME)
  }

  async connect() {
    try {
      // Send a ping to confirm a successful connection
      await this.db.command({ ping: 1 })
      console.log('Pinged your deployment. You successfully connected to MongoDB!')
    } catch (error) {
      // Ensures that the client will close when you finish/error
      // await this.client.close()
      console.log('error', error)
      throw error
    }
  }

  async indexUsers() {
    const exists = await this.users.indexExists(['email_1_password_1', 'username_1', 'email_1'])
    if (!exists) {
      this.users.createIndex({ email: 1, password: 1 })
      this.users.createIndex({ email: 1 }, { unique: true })
      this.users.createIndex({ username: 1 }, { unique: true })
    }
  }

  async indexRefreshToken() {
    const exists = await this.refreshToken.indexExists(['exp_1', 'token_1'])
    this.refreshToken.createIndex({ token: 1 })
    this.refreshToken.createIndex({ exp: 1 }, { expireAfterSeconds: 0 })
  }

  //async indexVideoStatus() {
  // exists = await this.videoStatus.indexExists(['name_1'])
  // if(!exists) {
  // this.video_status.createIndex({ name: 1 })
  // }
  // }

  async indexFollower() {
    const exists = await this.followers.indexExists(['user_id_1_followed_user_id_1'])
    if (!exists) {
      this.followers.createIndex({ user_id: 1, followed_user_id: 1 })
    }
  }

  get tweets(): Collection<Tweet> {
    return this.db.collection(process.env.DB_TWEET_COLLECTION as string)
  }

  get users(): Collection<User> {
    return this.db.collection(process.env.DB_USERS_COLLECTION as string)
  }

  get refreshToken(): Collection<RefreshToken> {
    return this.db.collection(process.env.DB_REFRESH_TOKENS_COLLECTION as string)
  }

  get hashtags(): Collection<Hashtag> {
    return this.db.collection(process.env.DB_HASHTAGS_COLLECTION as string)
  }

  get bookmarks(): Collection<Bookmark> {
    return this.db.collection(process.env.DB_BOOKMARK_COLLECTION as string)
  }

  get Likes(): Collection<LikeTweet> {
    return this.db.collection(process.env.DB_LIKES_COLLECTION as string)
  }

  get followers(): Collection<Follower> {
    return this.db.collection(process.env.DB_FOLLOWER_COLLECTION as string)
  }
}

//Tạo Object từ class DatabaseService
const databaseService = new DatabaseService()

export default databaseService
