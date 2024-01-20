import express from 'express'
import usersRouter from './routes/users.routes'
import databaseService from './services/database.service'
import { defaultErrorHandler } from './middlewares/error.middlewares'
import mediaRouter from './routes/medias.routes'
import { initFolder } from './utils/file'
import { config } from 'dotenv'

import { UPLOAD_VIDEO_DIR } from './constants/dir'
import staticRouter from './routes/static.route'
import tweetsRouter from './routes/tweet.routes'
import bookmarkRouter from './routes/bookmarks.routes'
import likesRouter from './routes/likes.routes'
config()
databaseService.connect().then(() => {
  databaseService.indexUsers()
  databaseService.indexRefreshToken()
  databaseService.indexFollower()
  // databaseService.indexVideoStatus()
})
const app = express()
const port = process.env.PORT || 4000

// Tạo folder upload:
initFolder()

app.use(express.json())

app.use('/users', usersRouter)
app.use('/medias', mediaRouter)
app.use('/tweets', tweetsRouter)
app.use('/bookmarks', bookmarkRouter)
app.use('/likes', likesRouter)
app.use('/static', staticRouter)
app.use('/static/video', express.static(UPLOAD_VIDEO_DIR))

// default error handler
app.use(defaultErrorHandler)

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})
