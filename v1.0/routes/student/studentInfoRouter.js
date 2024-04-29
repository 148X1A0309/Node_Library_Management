const express = require('express');
const router = express.Router();
const userInfo = require('../../controllers/userController')

router.post('/creatStudent', async (req, res, next) => {
    try {
        let result = await userInfo.creatNewAccount(req)
        res.json(result)
    }
    catch (err) {
        next(err)
    }
})

router.post('/loginUser',async (req, res, next) => {
    try {
        let result = await userInfo.checkMFALoginUser(req)
        res.json(result)
    }
    catch (err) {
        next(err)
    }
})


router.get('/getUser',customJWTVerifier,async (req, res, next) => {
    try {
        let result = await userInfo.getUser(req)
        res.json(result)
    }
    catch (err) {
        next(err)
    }
})


module.exports = router;