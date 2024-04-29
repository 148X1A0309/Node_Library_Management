const express = require('express');
const router = express.Router();

router.use('/admin', require('./admin/adminRouter'));
router.use('/employee', require('./librarian/librarianRouter'));
router.use('/student', require('./student/studentRouter'));

module.exports = router;