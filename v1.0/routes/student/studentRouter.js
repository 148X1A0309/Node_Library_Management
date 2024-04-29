const express = require('express');
const router = express.Router();

router.use('/create',require('./studentInfoRouter'));
router.use('/login',require('./studentInfoRouter'));
 

module.exports = router;