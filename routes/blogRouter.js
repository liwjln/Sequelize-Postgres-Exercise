const express = require('express');
const router = express.Router();
const controller = require('../controllers/blogController.js');

router.get('/', controller.showList);
router.get('/:id', controller.showDetails);

module.exports = router; 