//process.cwd => trả về đường dẫn gốc của project => C:\Users\ADMIN\Desktop\cypersoft\youtubeApp\node40\node40_backend + /public/img

import multer, { diskStorage } from 'multer'

//khắc phục vấn đề trùng tên hình
 const upload = multer({
    // dest: process.cwd() + "/public/img", 
    storage : diskStorage({
        destination : process.cwd() + "/public/img", // khai báo đường dẫn file
        filename : (req,file,callback) =>{          // đổi tên file
            //tránh trùng tên datetime , random 
            //hàm loại bỏ kí tự đặc biệt, khoảng trắng => regex
            let newName = new Date().getTime() + "_" + file.originalname //30032024_cat.jpg

            callback(null,newName)
        }
    })
});

export default upload