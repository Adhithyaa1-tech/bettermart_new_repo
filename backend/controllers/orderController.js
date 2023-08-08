const Order = require('../models/orderModel');
const Product = require('../models/productsModel');
const User = require('../models/userModel');

//create an order
module.exports.createOrder = async function(req, res) {
    try{

       

        const {
            shippingInfo,
            orderItems,
            paymentInfo,
            itemsPrice,
            taxPrice,
            shippingPrice,
            totalPrice,
          } = req.body;

        const order = await Order.create({
            shippingInfo,
            orderItems,
            paymentInfo,
            itemsPrice,
            taxPrice,
            shippingPrice,
            totalPrice,
            paidAt: Date.now(),
            user: req.user._id,
          });

          console.log('order created');

        if(!order){
            return res.status(404).json({
                success: false,
                message: 'order not created'
            })
        }
    
        res.status(201).json({
            success: true,
            order
        });
    

    }catch(err) {
        return res.status(500).json({
            success: false,
            message: err
        })
    }
    
}

module.exports.getSingleOrder = async function(req, res) {
    try{
        const order = await Order.findById(req.params.id).populate("user", "name email");
        console.log(order);
        if(!order) {
            return res.status(401).json({
                success: false,
                message: 'order not found'
            })
        }

        return res.status(200).json({
            success: true,
            order
        })

    }catch(err) {
        return res.status(500).json({
            success: false,
            message: err
        })
    }
    
}

module.exports.myOrders = async function(req, res) {
    try{
        const orders = await Order.find({user: req.user._id});
    
        if(!orders) {
            return res.status(401).json({
                success: false,
                message: 'orders not found'
            })
        }

        console.log('ordes', orders);

        return res.status(200).json({
            success: true,
            orders
        })

    }catch(err) {
        return res.status(500).json({
            success: false,
            message: err
        })
    }
}

//admin only.
module.exports.getAllOrders = async function(req, res) {

    try{
        const orders = await Order.find({});

        let totalAmt = 0;
        for(order of orders) {
            totalAmt+=order.totalPrice
        }
    

        return res.status(200).json({
            success: true,
            orders,
            totalAmt
        })

    }catch(err) {
        return res.status(500).json({
            success: false,
            message: err
        })
    }
   

}

module.exports.updateOrderStatus = async function(req, res) {
    const order = await Order.findById(req.params.id);

    if(order.status === 'Delivered'){
        return res.status(400).json({
            message: 'already delivred'
        })
    }

    order.orderItems.forEach(async order => {
        await updateStock(order.product, order.quantity)
    })

    order.status = req.body.status

    if(req.body.status === 'Delivered'){
        order.deliveredAt = Date.now();
    }

    await order.save({validateBeforeSave:false});

    res.status(200).json({
        success:true
    })
    
}

async function updateStock(id, quantity){

    const product = await Product.findById(id);
    product.stock -= quantity
    await product.save({validateBeforeSave:false});

}

module.exports.deleteOrder = async function(req, res) {
    try{
        const order =await Order.findById(req.params.id);

        await order.remove();

        res.status(200).json({
            message: 'deleted'
        })

    }catch(err){
        res.status(500).json({
            success:false,
            message: err
        })
    }
}