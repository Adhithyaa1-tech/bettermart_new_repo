const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
    name:{
        type:String,
        required: [true, "please enter product name"]
    },
    description:{
        type:String,
        required: [true, "please enter product description"]
    },
    price:{
        type: Number,
        required: [true, "Please enter product price"],
        maxLength:[8, "price cannot exceed 8 characters"]
    },
    rating:{
        type:Number,
        default:0
    },
    images:[
      {
        public_id:{
            type:String,
            required: true
        },
        url:{
            type:String,
            required: true
        }
      }
    ],
    category:{
        type:String,
        required: [true, "please enter category"]
    },
    stock: {
        type:Number,
        required: [true, "pls enter stock"],
        maxLength:[4, "stock cannot exceed 4 charaters"],
        default:1
    },
    numOfReviews:{
        type:Number,
        default:0
    },
    reviews:[
        {
            user: {
                type: mongoose.Schema.ObjectId,
                ref: 'User',
                required: true
            },
            
            name:{
                type:String,
                required: true
            },
            rating:{
                type:Number,
                required:true
            },
            comment:{
                type:String,
            }
        }
    ],
    user: {
        type: mongoose.Schema.ObjectId,
        ref: 'User',
        required: true
    }
}, {
    timestamps:true
});


module.exports = mongoose.model("Product", productSchema);


