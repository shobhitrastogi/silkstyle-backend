const jwt = require("jsonwebtoken")
        // Middleware function to verify JWT token
const verifyToken =(req,res,next)=>{    
        // Get the token from the request headers
    const authHeader =req.headers.token
        // Verify the token with the secret from environment variables
    if(authHeader){
        const token = authHeader.split(" ")[1]
        jwt.verify(token,process.env.JWT_SECURITY,(error,user)=>{
        // Send a 403 Forbidden response if the token is not valid
                if(error)  res.status(403).json("Token is not valid!")
         // If the token is valid, attach the user data to the request object
                req.user=user
            next()
        })
    }else{
         // Send a 401 Unauthorized response if no token is provided
        return res.status(401).json("You are not authenticated!")
    }
}
// Middleware function to verify token and admin authorization
const verifyTokenandAuthorization = (req,res,next)=>{
    verifyToken(req,res,()=>{
        // Check if the user is an admin
        if(res.user && res.user.id||req.user.isAdmin){
         next()
        }else{
        // Send a 403 Forbidden response if the user is not an admin
            res.status(403).json("You are not allowed to do that!");
        }
    })
}
const verifyTokenandAdmin = (req,res,next)=>{
    verifyToken(req,res,()=>{
        if(req.user.isAdmin){
         next()
        }else{
            res.status(403).json("You are not allowed to do that!");
        }
    })
}
module.exports = {verifyToken,verifyTokenandAuthorization,verifyTokenandAdmin };