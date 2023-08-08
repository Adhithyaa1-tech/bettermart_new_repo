const express = require('express');
const router = express.Router();

const usercontroller = require('../controllers/userController');
const { isAuthenticated, authorisedRoles } = require('../middlewares/auth');

// console.log("before")
router.post('/register', usercontroller.register);
router.post('/login', usercontroller.login);
router.get('/logout', usercontroller.logout);
router.post('/password/forgot', usercontroller.forgotPassword);
router.put('/password/reset/:token', usercontroller.resetPassword);
router.get('/me', isAuthenticated, usercontroller.getUserDetails);
router.put('/password/update', isAuthenticated ,usercontroller.updatePassword);
router.get('/admin/users',  isAuthenticated, authorisedRoles('admin'), usercontroller.getAllusers);
router.put('/me/update', isAuthenticated, usercontroller.updateUserProfile);




module.exports = router;

