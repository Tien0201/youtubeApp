import { decode } from "jsonwebtoken";
import { checkToken, createToken, createTokenRef, decodeToken , checkTokenRef} from "../config/jwt.js";
import { responseData } from "../config/response.js";
import sequelize from "../model/connect.js";
import initModels from "../model/init-models.js";
import bcrypt  from 'bcrypt'
import sendMail from "../config/sendMail.js";
import fs from 'fs'
import { error } from "console";
import compress_images from 'compress-images'
import { PrismaClient } from "@prisma/client";

const model = initModels(sequelize)

const prisma = new PrismaClient()

const getUser = async(req,res) =>{
    let data = await prisma.users.findMany()

    responseData(res,"Danh sách user",200,data);
};


const signUp = async(req,res) =>{
    const { fullName, email, password } = req.body;

    const checkEmail = await model.users.findOne({
        where: {
            email
        }
    });

    if (checkEmail)
    {
        responseData(res,"Email đã tồn tại",409,"");
    }else {
        const newUser = {
            full_name : fullName,
            email,
            pass_word : bcrypt.hashSync(password,10)
        }
        await model.users.create(newUser);
        responseData(res,"Đăng ký thành công",200,"");
    }
};

const login = async(req,res) =>{
let {email , password } = req.body
let token = "";
let tokenRef = "";
const checkEmail = await model.users.findOne({
        where: {
            email : email
        }
    });

    if ( checkEmail){
        if(bcrypt.compareSync(password ,checkEmail.pass_word))
        {   
             token = createToken({ userId : checkEmail.dataValues.user_id, fullName : checkEmail.dataValues.full_name} );
             console.log(token)
             
             tokenRef = createTokenRef({ userId : checkEmail.dataValues.user_id, fullName : checkEmail.dataValues.full_name}  );

             checkEmail.dataValues.refresh_token = tokenRef;
             
             await model.users.update(checkEmail.dataValues,{
                where: {
                    user_id : checkEmail.dataValues.user_id
                }
             })

             console.log('login token',token)
             console.log('ref token',tokenRef)
   
            responseData(res,"Đăng nhập thành công",200, token);

        }else{
            responseData(res,"Mật khẩu không đúng",400,"");
        }
        return;
    }
    responseData(res,"Email không đúng",400,"");
}

const loginFacebook = async(req,res) =>{
    let token = ""
    const { fullName, email, faceAppId } = req.body;

    const checkUser = await model.users.findOne({
        where: {
            face_app_id : faceAppId
        }
    });

    if (checkUser)
    {
        token = createToken({ userId : checkUser.dataValues.user_id}, {hoTen : checkUser.dataValues.full_name} )
        // responseData(res,"Đăng nhập thành công",200,"token");
    }else {
        let newData = {
            full_name : fullName,
            email : email,
            face_app_id : faceAppId,
            pass_word : "",
            role : "USER"
        }

        let data = await model.users.create(newData);
        token = createToken({ userId : data.dataValues.user_id})
    }
    responseData(res,"Login thành công",200,token);
};

const resetToken = async (req, res) => {

    let { token } = req.headers;
    // check token 
    let errToken = checkToken(token);
    if (errToken != null && errToken.name != "TokenExpiredError") {
        responseData(res, "Không có quyền ", 401, "");
        return;
    }

    // get user => refesh_token
    let { userId } = decodeToken(token);

    let getUser = await model.users.findByPk(userId);
    // check refresh_token => Expired
    let errTokenRef = checkTokenRef(getUser.dataValues.refresh_token)
    if (errTokenRef != null) {
        responseData(res, "Không có quyền ", 401, "");
        return;
    }
    // create token

    let {key} = decodeToken(getUser.dataValues.refresh_token);
    if (decodeToken.key != key){
        responseData(res, "Không có quyền ", 401, "");
        return; 
    }

    let newToken = createToken({ userId: getUser.dataValues.user_id ,key });
    responseData(res, "Login thành công", 200, newToken);

}

const randomCode = (length) => {
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let result = '';
    const charactersLength = characters.length;
    for (let i = 0; i < length; i++) {
        result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
}


const checkEmail = async (req, res) => {
    let {email} = req.body;
    let checkEmail = await model.users.findOne({
        where: {
            email
        }
    })

    if(!checkEmail){
        responseData(res, "Email khong ton tai", 404, ""); 
        return;
    }
    //tao code random => them code table => gui code
    let code = randomCode(6);
    let newCode = {
        code ,
        expired : new Date()
    }

    await model.code.create(newCode)
    sendMail(email,"lay lai mat khau", code)
    responseData(res, "", 200, "");



}
const checkCode = async (req, res) => {
    let { code } = req.body

    let checkCode = await model.code.findOne({
        where: {
            code
        }
    })
    if (!checkCode) {
        responseData(res, "Mã xác minh không đúng ", 404, code);
        return;
    }
    
    // check hạn sử dụng
    // remove code => DELETE FROM WHERE
    await model.code.destroy({
        where: {
            id: checkCode.id
        }
    })
    responseData(res, "", 200, "");


}
const changePass = async (req, res) => {
    
}

const uploadAvatar = async (req,res) =>{
    let file = req.file;
    let {token} = req.headers;
    let {userId} = decodeToken(token)

    let getUser = await model.users.findByPk(userId);
    getUser.avatar = file.filename;
    await model.users.update(getUser.dataValues, {
        where : {
            user_id : userId
        }
    })
    responseData(res, "Upload Thanh Cong", 200, file.filename);
}

const uploadAvatarBase64 = async(req,res) =>{
    
    let file = req.file;

    // fs.readFile(process.cwd() + "/public/img/" + file.filename, (err, data) =>{

    //     // let base64 = Buffer.from(data).toString("base64")
    //     let base64 = `data${file.mimetype};base64` + Buffer.from(data).toString("base64")
    //     responseData(res, "Upload Thanh Cong", 200, base64);
    // })

    compress_images(
        process.cwd() + "/public/img/" + file.filename,
        process.cwd() + "/public/video/",
    { compress_force: false, statistic: true, autoupdate: true }, false,
        { jpg: { engine: "mozjpeg", command: ["-quality", "60"] } },
        { png: { engine: "pngquant", command: ["--quality=20-50", "-o"] } },
        { svg: { engine: "svgo", command: "--multipass" } },
        { gif: { engine: "gifsicle", command: ["--colors", "64", "--use-col=web"] } },
    function (error, completed, statistic) {
    console.log("-------------");
    console.log(error);
    console.log(completed);
    console.log(statistic);
    console.log("-------------");
    })
}

const getDataChat = async(req,res)=> {
    const roomId = req.cookies.roomid
    console.log(roomId)
    let data = await prisma.chat.findMany({
        where : {
            room_id : roomId
        }
    })

    responseData(res,"ok",200,data);
}

export {signUp,
    login,
    loginFacebook,
    resetToken,
    checkEmail,
    checkCode,
    changePass,
    uploadAvatar,
    uploadAvatarBase64,
    getUser,
    getDataChat
}