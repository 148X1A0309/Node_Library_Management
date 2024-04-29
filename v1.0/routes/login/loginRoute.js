const express = require('express');
const router = express.Router();
const userController = require("../../controllers/loginController");

router.post('/login-page', async (req, res, next) => {
    try {
        let result = await userController.loginUser(req);
        res.json(result);
    }
    catch (err) {
        next(err);
    }
})
module.exports=router;