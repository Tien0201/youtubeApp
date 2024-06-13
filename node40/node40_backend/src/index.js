
import express from 'express'
import cors from 'cors'
import { logger } from './utils/logger.js'
import rootRouter from './routes/rootRouter.js'
import cookieParser from 'cookie-parser';

const app = express();
const port = 8800;


//middlewares
app.use(express.json());
app.use(cookieParser());
app.use(cors());
app.use(logger);
app.use(rootRouter);

app.use(express.static(".")) // định vị đường dẫn load tài nguyên

app.listen(port , () =>{
    console.log(`Server running at http://localhost:${port}/`);
});




import { createServer } from "http";
import { Server } from "socket.io";
import { Prisma, PrismaClient } from '@prisma/client';


let prisma = new PrismaClient();
const httpServer = createServer(app);

const io = new Server(httpServer, {
    cors: {
        origin: "*"
    }
});

io.on("connection", (socket) => {
    socket.on("send-message", async(data) =>{    
        //leave room
        // socket.rooms.forEach(item =>{
        //     socket.leave(item)  item la roomId
        // })

        //room

        socket.on("join-room", async(roomId) =>{
            socket.join(roomId)

            let data = await prisma.chat.findMany({
                where : {
                    room_id : roomId
                }
            })
            io.to(roomId).emit("data-chat" , data)
        }) 

        //db
        let newData = {
            user_id : data.user_id,
            content : data.content,
            room_id : data.roomId,
            date : new Date()
        }
        await prisma.chat.create({data : newData})
        io.to(data.roomId).emit("sv-send-message" , data) //gửi message đúng với room
    })
});

httpServer.listen(2000);


import swaggerUi from 'swagger-ui-express'; //cấu hình giao diện
import swaggerJsDoc  from 'swagger-jsdoc';

const options = {
    definition: { //cấu hình giao diện
        info: {
            title: "api",
            version: "1.0.0"
        }
    },
    apis: ["src/swagger/index.js"] 
}

const specs = swaggerJsDoc(options);

app.use("/swagger", swaggerUi.serve, swaggerUi.setup(specs));

//2 cách viết api : 1 json , 2 command

/**
 * @swagger
 * /api/v1/user/getUser:
 *  get:
 *      description: responses
 *      tags: [User]
 *      responses:
 *          200: 
 *              description: success   
 */

/**
 * @swagger
 * /api/v1/user/updateUser/{id}:
 *  put:
 *      description: responses
 *      tags: [User]
 *      parameters:
 *      - in: path
 *        name: id
 *      - in: body
 *        name: user
 *        schema:
 *           type: object
 *           properties:
 *             userName:
 *               type: string
 *             firstName:
 *               type: string
 *             lastName:
 *               type: string
 *      responses:
 *          200: 
 *              description: res   
 */