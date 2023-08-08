const express = require('express');
const router = express.Router();

const ordercontroller = require('../controllers/orderController');
const { isAuthenticated, authorisedRoles } = require('../middlewares/auth');

router.post('/order/create',isAuthenticated, ordercontroller.createOrder);
router.get('/order/:id', isAuthenticated, ordercontroller.getSingleOrder);
router.get('/orders/me', isAuthenticated ,ordercontroller.myOrders)
router.get('/admin/orders', isAuthenticated, authorisedRoles('admin'), ordercontroller.getAllOrders);
router.post('/admin/order/:id', isAuthenticated, authorisedRoles('admin'), ordercontroller.updateOrderStatus);
router.delete('/admin/order/:id', isAuthenticated, authorisedRoles('admin'), ordercontroller.deleteOrder);


module.exports = router


