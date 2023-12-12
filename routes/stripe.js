const router = require('express').Router();
const stripe= require('stripe')(process.env.STRIPE_KEY)
// Route to handle payment processing
router.post("/payment",(req,res)=>{
     // Create a charge using the Stripe library
    stripe.charges.create({
         // Payment source, typically a token representing a payment method
        source:req.body.tokenId,
         // Amount to charge (in cents or the smallest currency unit)
        amount:req.body.amount,
        // Currency code (e.g., "IND" for Indian Rupees)
        currency:"usd"
    },(stripeErr,stripeRes)=>{
        if(stripeErr){
            // Handle and respond with an error if the payment processing encounters an issue
            res.status(500).json(stripeErr)
        } else{
            // If the payment is successful, respond with a 200 status and the Stripe response
            res.status(200).json(stripeRes)
        }
    })
})

module.exports = router;