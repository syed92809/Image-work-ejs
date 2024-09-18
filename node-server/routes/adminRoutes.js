const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController');
const upload = require('multer')({ dest: 'uploads/' }); 
const { isAuthenticated, authorizeRole } = require('../middleware/authMiddleware');

router.get('/dashboard',authorizeRole(1) ,isAuthenticated ,adminController.getDashboardCounts);

router.get('/upload-image', adminController.Image);
router.post('/upload-image',authorizeRole(1) ,isAuthenticated , upload.single('uploadFile'), adminController.uploadImage);

router.get('/batch-listing',authorizeRole(1) ,isAuthenticated , adminController.batchListing);
router.get('/batch',authorizeRole(1) ,isAuthenticated , adminController.Batch);
router.post('/batch',authorizeRole(1) ,isAuthenticated , adminController.createBatch);

router.get('/user',authorizeRole(1) ,isAuthenticated , adminController.User);
router.post('/user',authorizeRole(1) ,isAuthenticated , adminController.User)
router.get('/user-listing',authorizeRole(1) ,isAuthenticated , adminController.userListing);
router.get('/user-detail/:id',authorizeRole(1) ,isAuthenticated , adminController.userDetail);
router.post('/user-detail/:id',authorizeRole(1) ,isAuthenticated , adminController.updateUserDetail);


module.exports = router;