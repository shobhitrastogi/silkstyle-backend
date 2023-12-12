const mongoose = require('mongoose')
const ProductSchema = new mongoose.Schema(
    {
        title : {type:String,required :true},
        desc : {type:String,required :true},
        img :{type:String,required :true},
        categories :{type:Array,default :[]},
        size :{type:Array},
        color:{type:Array},
        price :{type:Number,required :true},
        inStock:{type:Boolean,default:true}
    }
)
module.exports = mongoose.model("Product",ProductSchema)