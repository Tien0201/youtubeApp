import express from 'express'
import videoRouter from './videoRouter.js'
import userRouter from './userRoter.js'

const rootRouter = express.Router()

rootRouter.use('/video', videoRouter)
rootRouter.use('/user', userRouter)

export default rootRouter
