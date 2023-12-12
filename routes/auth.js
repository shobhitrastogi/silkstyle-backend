const router = require('express').Router();
const User = require ('../models/User')
const jwt = require('jsonwebtoken')
const CryptoJS = require('crypto-js')
// Register a new user
router.post('/register',async(req,res)=>{
    // Create a new User instance with encrypted password
    const newUser = new User({
        username:req.body.username,
        email:req.body.email,
        password:CryptoJS.AES.encrypt(req.body.password,process.env.PASSWORD_SECURITY).toString(),
    })
    try {
        // Save the new user to the database
        const savedUser =await newUser.save()
        console.log(savedUser);
        res.send(`User with name ${req.body.username} saved in the database`)
        
    } catch (error) {
        console.log(error);
    }
})

// User login
router.post('/login',async(req,res)=>{
    try {
        // Find the user by username in the database
        const user = await User.findOne({username:req.body.username})
         // If the user is not found, return a 401 Unauthorized response
        !user && res.status(401).json("Wrong Credentials!")
         // Decrypt the stored password and compare with the provided password
        const hashedpassword = CryptoJS.AES.decrypt(user.password,process.env.PASSWORD_SECURITY)
        const originalpassword = hashedpassword.toString(CryptoJS.enc.Utf8);
        // If the password doesn't match, return a 401 Unauthorized response
        originalpassword !==req.body.password && res.status(401).json("Wrong Credentials!")
         // Generate an access token for the user
        const accessToken = jwt.sign({
            id:user._id,
            isAdmin:user.isAdmin
        },process.env.JWT_SECURITY,{expiresIn:'3d'})

      // Remove the password field from the user document, construct a response, and send it
        const {password , ...others} = user._doc;
        res.status(200).json({...others,accessToken})
        console.log(others);
    } catch (error) {
         // Handle any errors and return a 500 Internal Server Error response
        res.status(500).json(error)
    }
})

module.exports =router;