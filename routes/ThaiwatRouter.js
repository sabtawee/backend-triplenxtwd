const express = require('express');
const { GetProductLocation, ChangeLocation, portProductStock, portSeller } = require('../controllers/ThaiwatController');

const router = express.Router();

router.post('/location', GetProductLocation);
router.post('/change-location', ChangeLocation);
router.post('/port-product-stock', portProductStock);
router.post('/port-seller', portSeller);

module.exports = router;
