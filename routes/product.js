const Product = require('../models/Product');
const {verifyTokenandAuthorization, verifyTokenandAdmin }= require('./verifyToken');

const router = require('express').Router();

// CREATE a new product (requires admin authorization)
router.post('/',verifyTokenandAdmin,async(req,res)=>{
    // Create a new Product instance based on the request body
    const newProduct = new Product(req.body)
    try {
        // Save the new product to the database
        const savedProduct =await newProduct.save()
        res.status(200).json(savedProduct)
    } catch (error) {
        res.status(500).json(error)
    }

})
// shobhit eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY1MzRjZjkwOWRhYjZlYTY0ZTFiMmI5OSIsImlzQWRtaW4iOnRydWUsImlhdCI6MTY5Nzk2MDI2MiwiZXhwIjoxNjk4MjE5NDYyfQ.towzZfjUjkGrk7uufA5gkSYyKXOOZQ6SFp2DOoy_asE


// UPDATE a product by its ID (requires admin authorization)
router.put("/:id",verifyTokenandAdmin,async(req,res)=>{
   
    try {
          // Update the product by its ID and set it to the new data provided in the request body
        const updatedProduct =await Product.findByIdAndUpdate(req.params.id,{
            $set:req.body
        },{new:true})
        res.status(200).json(updatedProduct)
    } catch (error) {
        res.status(500).json(error)
    }
})
// DELETE a product by its ID (requires admin authorization)
router.delete("/:id",verifyTokenandAdmin,async(req,res)=>{
    try {
          // Delete a product by its ID
        await Product.findByIdAndDelete(req.params.id)
        res.status(200).json("Product has been deleted")
    } catch (error) {
        res.status(500).json(error)
    }
})
// GET a product by its ID
router.get("/find/:id",async(req,res)=>{
    try {
         // Find a product by its ID and return it
        const product = await  Product.findById(req.params.id)
        
      
        res.status(200).json({product})
    } catch (error) {
        res.status(500).json(error)
    }
})

// GET All Products with optional filters for new and by category
router.get("/",async(req,res)=>{
    const queryNew =req.query.new
    const queryCategory =req.query.category
    try {
        let products;
        if (queryNew) {
              // Get the newest products based on 'new' query parameter
            products=await Product.find().sort({createdAt:-1}).limit(5)
        }else if(queryCategory){
              // Get products by category based on the 'category' query parameter
            products= await  Product.find({
                categories:{
                    $in:[queryCategory],
                },
            })
        }else{
             // Get all products if no filters are applied
            products = await  Product.find()    
        }

        res.status(200).json({products})
    } catch (error) {
        res.status(500).json(error)
    }
})




module.exports =router;