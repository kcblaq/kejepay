const jwt = require("jsonwebtoken");
const env = process.env

const Auth = (req,res, next) => {
    const token = req.body.token || req.query.token || req.headers["token"]
    if(!token) {
        res.status(403).json({message: "A token is required for authentication"})
    }

    try {
        const decode = jwt.verify(token, env.TOKEN_SECRET)
        req.user = decode
    } catch (error) {
        res.status(401).json({message:"Invalid token"})
    }
    return next()
}

module.exports = Auth