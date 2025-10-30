const express = require('express');
const router = express.Router();
const reportsController = require('../controllers/reportsController');
const auth = require('../middleware/auth');

router.get('/stock-quality', auth, reportsController.getStockQuality);

module.exports = router;
