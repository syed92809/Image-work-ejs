const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController');

router.get('/dashboard', adminController.dashboard);
router.get('/upload-image', adminController.Image);
router.get('/batch-listing', adminController.batchListing);
router.get('/batch', adminController.Batch);
router.get('/user', adminController.User);
router.get('/user-listing', adminController.userListing);
module.exports = router;