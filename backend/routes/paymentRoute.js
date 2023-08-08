const express = require('express');
const router = express.Router();
const { isAuthenticated, authorisedRoles } = require('../middlewares/auth');

const paymentController = require('../controllers/paymentController');

router.post('/payment/process', isAuthenticated, paymentController.processPayment);

router.get('/stripeapikey', isAuthenticated, paymentController.sendStripeApiKey);

module.exports=router;