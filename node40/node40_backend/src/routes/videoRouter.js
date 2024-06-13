import express from 'express'
import { getVideo , updateVideo , getVideoType, getVideoByType, getVideoPage , getVideoId  , getComment,postComment} from '../controller/videoController.js'
import { middleToken } from '../config/jwt.js'

const videoRouter = express.Router()

videoRouter.get("/get-video", getVideo)

videoRouter.get("/update-video",middleToken, updateVideo)

videoRouter.get("/get-video-type", getVideoType)

videoRouter.get("/get-video-by-type/:typeid", getVideoByType)

videoRouter.get("/get-video-page/:page", getVideoPage)

videoRouter.get("/get-video-id/:videoid", getVideoId)

videoRouter.get("/get-comment/:videoid", getComment)

videoRouter.post("/post-comment/",middleToken,  postComment)



export default videoRouter








