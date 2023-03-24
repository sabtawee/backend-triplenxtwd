const express = require("express");
const router = express.Router();
const { getProducts, createProduct, getProductsByReCom, getProductsByBarcode, getProductInCart, getCategorys } = require("../controllers/ProductController");


router.get("/", getProducts);
router.get("/recom", getProductsByReCom);
router.get("/barcode/:barcode", getProductsByBarcode);
router.post("/", createProduct);
router.post("/incart", getProductInCart);
router.get("/category", getCategorys);

module.exports = router;