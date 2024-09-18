const express = require("express");
const router = express.Router();
const imagesController = require("../controllers/imageController")
const { isAuthenticated, authorizeRole } = require('../middleware/authMiddleware');


router.get("/image-listing",isAuthenticated, imagesController.getImages);
router.post("/update-option", imagesController.updateImageOption);

module.exports = router; 