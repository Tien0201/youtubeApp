import nodemailer from 'nodemailer'


export default (to,subject, text) =>{
    let configMail = nodemailer.createTransport({
        service : "gmail",
        auth :{
            user : "tonynguyenquoc290@gmail.com",
            pass : "ggjftgmnarjtllgv" 
        }
    })

    configMail.sendMail({
        from : "tonynguyenquoc290@gmail.com",
        to,
        subject,
        text,
    }),(err,info)=>{

    }
}