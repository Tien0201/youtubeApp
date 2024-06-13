import jwt from 'jsonwebtoken'

export const createToken = (data) =>{
    return jwt.sign(data,"BI_MAT",{expiresIn: "5s"});
}

export const createTokenRef = (data) =>{
    return jwt.sign(data,"BI_MAT_REFRESH",{expiresIn: "50d"});
}

// export const checkToken = (token) => jwt.verify(token, "BI_MAT", error => error)

export const checkToken = (token) =>{
     return jwt.verify(token,"BI_MAT", (err,decode)=>{
        return err
    })
}

export const checkTokenRef = (token) => jwt.verify(token, "BI_MAT_REFRESH", error => error)


export const decodeToken = (token) =>{
    return jwt.decode(token);
}

export const middleToken = (req, res, next) => {

    const { token } = req.headers;
    let error = checkToken(token);

    if (error == null) {
        next()
    } else {
        if(error.name = "TokenExpiredError")
            res.status(401).send("TokenExpiredError")
        else
        res.status(401).send("Không có quyền")
    }
}