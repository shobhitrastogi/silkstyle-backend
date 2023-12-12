const Cart = require('../models/Cart');
const {verifyTokenandAuthorization, verifyTokenandAdmin, verifyToken }= require('./verifyToken');

const router = require('express').Router();

// CREATE a new shopping cart (requires token verification)
router.post('/',verifyToken,async(req,res)=>{
     // Create a new Cart instance based on the request body
    const newCart = new Cart(req.body)
    try {
         // Save the new shopping cart to the database
        const savedCart =await newCart.save()
        res.status(200).json(savedCart)
    } catch (error) {
        res.status(500).json(error)
    }

})


// UPDATE a shopping cart by its ID (requires user authorization) 
router.put("/:id",verifyTokenandAuthorization,async(req,res)=>{
   
    try {
         // Update the shopping cart by its ID and set it to the new data provided in the request body
        const updatedCart =await Cart.findByIdAndUpdate(req.params.id,{
            $set:req.body
        },{new:true})
        res.status(200).json(updatedCart)
    } catch (error) {
        res.status(500).json(error)
    }
})

// DELETE a shopping cart by its ID (requires user authorization)
router.delete("/:id",verifyTokenandAuthorization,async(req,res)=>{
    try {
        // Delete a shopping cart by its ID
        await Cart.findByIdAndDelete(req.params.id)
        res.status(200).json("Cart has been deleted")
    } catch (error) {
        res.status(500).json(error)
    }
})
// GET a shopping cart by its ID (requires user authorization)
router.get("/find/:id",verifyTokenandAuthorization,async(req,res)=>{
    try {
        // Find a shopping cart by its ID   
        const cart = await  Cart.findOne(req.params.id)
        
      
        res.status(200).json({cart})
    } catch (error) {
        res.status(500).json(error)
    }
})

// GET All shopping carts (requires admin authorization) 
router.get("/",verifyTokenandAdmin,async(req,res)=>{
   
    try {
        const carts= await Cart.find()
        res.status(200).json({carts})
    } catch (error) {
        res.status(500).json(error)
    }
})




module.exports =router;