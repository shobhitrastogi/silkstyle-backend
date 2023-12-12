const User = require('../models/User');
const {verifyTokenandAuthorization, verifyTokenandAdmin }= require('./verifyToken');

const router = require('express').Router();
// Route to update user information
router.put("/:id",verifyTokenandAuthorization,async(req,res)=>{
    if(req.body.password){
        // Encrypt the user's password using CryptoJS if provided
        req.body.password=CryptoJS.AES.encrypt(req.body.password,process.env.PASSWORD_SECURITY).toString();
    }
    try {
         // Update the user's information by their ID
        const updatedUser =await User.findByIdAndUpdate(req.params.id,{
            $set:req.body
        },{new:true})
        res.status(200).json(updatedUser)
    } catch (error) {
        res.status(500).json(error)
    }
})
// Route to delete a user
router.delete("/:id",verifyTokenandAuthorization,async(req,res)=>{
    try {
        // Delete a user by their ID
        await User.findByIdAndDelete(req.params.id)
        res.status(200).json("User has been deleted")
    } catch (error) {
        res.status(500).json(error)
    }
})
// Route to get user details by ID (requires admin authorization)
router.get("/find/:id",verifyTokenandAdmin,async(req,res)=>{
    try {
        // Find a user by their ID, excluding the password field from the response
        const user = await  User.findById(req.params.id)
        await User.findById(req.params.id)
        const {password , ...others} = user._doc;
        res.status(200).json({others})
    } catch (error) {
        res.status(500).json(error)
    }
})

// Route to get all users (requires admin authorization)
router.get("/",verifyTokenandAdmin,async(req,res)=>{
    const query =req.query.new
    try {
          // Get all users or limit the results to the newest 5, based on the 'new' query parameter
        const users = query?await User.find().sort({_id:-1}).limit(5) : await User.find()
        await User.findById(req.params.id)
      
        res.status(200).json({users})
    } catch (error) {
        res.status(500).json(error)
    }
})
// Route to get user statistics for the last year (requires admin authorization)
router.get('/stats',verifyTokenandAdmin,async(req,res)=>{
    const date = new Date()
    const lastyear = new Date(date.setFullYear(date.getFullYear()-1))
    try {
         // Retrieve user statistics for the last year based on their creation date
        const data=await User.aggregate([
            {$match :{createdAt:{$gte :lastyear}}},
            {
                $project :{
                    month:{$month:"$createdAt"}
                }
            },
            {
                $project: {
                    month: { $month: "$createdAt" }
                }
            },
        ])
        res.status(200).json(data)
    } catch (err) {
        res.status(500).json(err)
    }

})



module.exports =router;