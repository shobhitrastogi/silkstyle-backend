const Order = require('../models/Order');
const {verifyTokenandAuthorization, verifyTokenandAdmin, verifyToken }= require('./verifyToken');

const router = require('express').Router();

// CREATE an order (requires token verification)
router.post('/',verifyToken,async(req,res)=>{
    const newOrder = new Order(req.body)
    try {
        const savedOrder =await newOrder.save()
        res.status(200).json(savedOrder)
    } catch (error) {
        res.status(500).json(error)
    }

})


// UPDATE an order by its ID (requires admin authorization)
router.put("/:id",verifyTokenandAdmin,async(req,res)=>{
   
    try {
        const updatedOrder =await Order.findByIdAndUpdate(req.params.id,{
            $set:req.body
        },{new:true})
        res.status(200).json(updatedOrder)
    } catch (error) {
        res.status(500).json(error)
    }
})
// DELETE an order by its ID (requires admin authorization)
router.delete("/:id",verifyTokenandAdmin,async(req,res)=>{
    try {
        await Order.findByIdAndDelete(req.params.id)
        res.status(200).json("Order has been deleted")
    } catch (error) {
        res.status(500).json(error)
    }
})
// GET orders by a user's ID (requires authorization)
router.get("/find/:id",verifyTokenandAuthorization,async(req,res)=>{
    try {
        const orders = await  Order.find(req.params.id)
        
      
        res.status(200).json({orders})
    } catch (error) {
        res.status(500).json(error)
    }
})

// GET all orders (requires admin authorization)
router.get("/",verifyTokenandAdmin,async(req,res)=>{
   
    try {
        const orders= await Orders.find()
        res.status(200).json({orders})
    } catch (error) {
        res.status(500).json(error)
    }
})
// Route to get monthly income data, requiring admin authorization to access

router.get("/income", verifyTokenandAdmin, async (req, res) => {
    const date = new Date();
    // Calculate the date of the last month
    const lastMonth = new Date(date.setMonth(date.getMonth() - 1));
    // Calculate the date of the month prior to the last month
    const previousMonth = new Date(new Date().setMonth(lastMonth.getMonth() - 1));
  
    try {
        // Use the 'Order' model to perform aggregation on order data
      const income = await Order.aggregate([
        // Match orders created in or after the previous month
        { $match: { createdAt: { $gte: previousMonth } } },
        {
          $project: {
             // Extract the month from the 'createdAt' field
            month: { $month: "$createdAt" },
            // Assign the 'amount' field to 'sales'
            sales: "$amount",
          },
        },
        // Group the results by the extracted month
        {
          $group: {
            _id: "$month",
            total: { $sum: "$sales" },
          },
        },
      ]);
      res.status(200).json(income);
    } catch (err) {
      res.status(500).json(err);
    }
  });


module.exports =router;
// zk8-5wrSj6R27fd
// token pk_test_51O4kh2SHLeR3BkWX0nAJPPnlOzzLApy5yfVTqQxCpwk9gXFuuw9FNX9RJPSsDvORZa28YzyMA3JpCVK433HXL2YO00VcEmGGnN
// secret key token sk_test_51O4kh2SHLeR3BkWXSLnZ16M7xsW2nHRgFhxVmRaUrW3rqcfxrce6bTZZ1PL167WRyB62zmmyZ7c6ScaJp1HsD39s00ikSSXn1l