import express, { NextFunction, Request, Response } from 'express'
import usersRouter from './routes/users.routes'
import databaseService from './services/database.service'
import { defaultErrorHandler } from './middlewares/error.middlewares'
databaseService.connect()
const app = express()
const port = 3000

app.use(express.json())

app.use('/users', usersRouter)

// default error handler
app.use(defaultErrorHandler)

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})
