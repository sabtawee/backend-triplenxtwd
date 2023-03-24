const express = require("express");
const { getImages } = require("../controllers/ImageController");

const router = express.Router();

router.get("/:imagename", getImages);

module.exports = router;