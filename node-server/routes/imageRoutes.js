const express = require("express");
const router = express.Router();
const imagesController = require("../controllers/imageController")


router.get("/", imagesController.getImages);

module.exports = router;