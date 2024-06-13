import { decode } from "jsonwebtoken";
import { responseData } from "../config/response.js";
import sequelize from "../model/connect.js";
import initModels from "../model/init-models.js";
import { decodeToken } from "../config/jwt.js";
import video from '../model/video.js'
import { PrismaClient } from "@prisma/client";

const model = initModels(sequelize)

//prisma
const prisma = new PrismaClient()

const getVideo = async (req, res) => {
    let data = await model.video.findAll({
        include : ["type"]
    });

    let dataPrisma = await prisma.video.findMany({
        include : {
            video_comment :{
                include : {
                    users : true
                }
            }
        }
    })

    responseData(res,"Thành Công",200,dataPrisma)

}

const updateVideo = (req, res) => {
    res.send("hello updatevideo")
}

const getVideoType = async (req, res) => {
    let data = await model.video_type.findAll();
    responseData(res,"Thành Công",200,data)
}

const getVideoByType = async (req, res) => {
    const {typeid} = req.params
    let data = await model.video.findAll({
        where : {
            type_id : typeid
        }
    })
    responseData(res,"Thành Công",200,data)
}

const getVideoPage = async (req, res) => {
    let { page } = req.params
    let  pagesize  = 3
    let index = (page - 1) * pagesize
    let data = await model.video.findAll({
        offset: index, //vi tri index
        limit: pagesize
    });

    let dataCount = await model.video.count();

    responseData(res,"Thành Công",200, {data , pagination : Math.ceil(dataCount / pagesize) })
}

const getVideoId = async (req, res) => {
    let { videoid } = req.params;

    let data = await model.video.findByPk(videoid, {include: "user"});

    responseData(res,"Thành Công",200,data);
}

const getComment = async (req, res) => {
    let { videoid } = req.params;
    console.log(videoid)
    let data = await model.video_comment.findAll({
        where : {
            video_id : videoid
        },
        include : ["user"]
    })

    responseData(res,"Thành Công",200,data);
}

const postComment = async (req, res) => {
    let { videoid, content } = req.body;
    let { token } = req.headers;
    let { userId } = decodeToken(token)
    console.log(videoid)
    let newComment = {
        video_id : videoid,
        user_id : userId,
        content,
        date_create : new Date()
    }
    await model.video_comment.create(newComment)
    responseData(res,"Thành Công",200,"");
}

export {getVideo ,
        updateVideo,
        getVideoType,
        getVideoByType,
        getVideoPage,
        getVideoId,
        getComment,
        postComment
    }   