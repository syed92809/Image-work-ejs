const express = require("express");
const router = express.Router();
const imagesController = require("../controllers/imageController")


router.get("/image-listing", imagesController.getImages);
router.post("/update-option", imagesController.updateImageOption);

module.exports = router; 