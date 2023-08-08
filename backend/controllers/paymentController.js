const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);


module.exports.processPayment =async function(req, res){
    try {
       

        const myPayment = await stripe.paymentIntents.create({
            amount: req.body.amount,
            currency: 'inr',
    
        })

        console.log(myPayment);
    
        return res.status(200).json({
            success: true,
            client_secret: myPayment.client_secret
        })
        
    } catch (error) {
        return res.status(500).json({
            success: false,
            error,
        })
    }
  
}

module.exports.sendStripeApiKey = async function(req, res){
    try {
        console.log('hello world');
        console.log(process.env.STRIPE_API_KEY);
        return res.status(200).json({
            success: true,
            stripeApiKey: 'pk_test_51N88uDSDuaFRGf0WnpKCriBAzKlZNYMzJActqypgd4uFjpltDyqmUM6ufp7o5JTlovOjS5tWn8lgZofDLMxCTIwQ006dpaP32R'
        })
        
    } catch (error) {
        return res.status(500).json({
            success: false,
            error,
        })
    }
    
}