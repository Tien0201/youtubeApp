import express from 'express'
import { signUp,login,loginFacebook,resetToken, checkEmail , checkCode, changePass, uploadAvatar, uploadAvatarBase64, getUser, getDataChat} from '../controller/userController.js'
import multer, { diskStorage } from 'multer'
import upload from '../config/upload.js'
const userRouter = express.Router()

userRouter.post("/signup", signUp)

userRouter.post("/login", login)

userRouter.post("/login-facebook", loginFacebook)

userRouter.post("/reset-token", resetToken)

userRouter.post("/check-email", checkEmail)

userRouter.post("/check-code", checkCode)

userRouter.post("/change-pass", changePass)

userRouter.post("/upload-avatar", upload.single("avatar") , uploadAvatar)

userRouter.post("/base64", upload.single("avatar") , uploadAvatarBase64)


userRouter.get("/get-data-chat", getDataChat)





userRouter.get("/get-user",getUser)

userRouter.get("/send-mail", (req,res) =>{
    let configMail = nodemailer.createTransport({
        service : "gmail",
        auth :{
            user : "tonynguyenquoc290@gmail.com",
            pass : "ggjftgmnarjtllgv" 
        }
    })

    configMail.sendMail({
        from : "tonynguyenquoc290@gmail.com",
        to : "tiennguyenquoc290@gmail.com",
        subject : "hello from nodejs",
        text : "hello hello hello hello"
    }),(err,info)=>{
        console.log(err);
        console.log(info)
    }
}) 


export default userRouter








