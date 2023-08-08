const express = require('express');
const router = express.Router();
const { isAuthenticated, authorisedRoles } = require('../middlewares/auth');

const productController = require('../controllers/productController');

router.get('/products', productController.getAllProducts);
router.post('/admin/product/new', isAuthenticated, authorisedRoles("admin") ,productController.createProduct);
router.put('/admin/product/:id',isAuthenticated, authorisedRoles("admin") ,productController.updateProduct);
router.delete('/admin/product/:id', isAuthenticated, authorisedRoles("admin") ,productController.deleteProduct);
router.get('/product/:id',productController.getProductDetails);
router.put('/review', isAuthenticated, productController.createProductReview);
router.get('/reviews/:id', isAuthenticated, productController.getAllReviewsOfProduct);
router.get('/admin/products', isAuthenticated, authorisedRoles("admin"), productController.getAdminProducts);


module.exports = router;