const { ObjectID } = require("mongodb");
const studentInfo = require('../../models/studentInfoModel')
require('dotenv').config();
const OTPAuth = require("otpauth");
const encode = require("hi-base32");
const QRCode = require('qrcode');
const crypto = require('crypto');
class UserController {

    constructor() {
    }

    creatNewAccount(req) {
        return new Promise(async (resolve, reject) => {
            try {
                if (!req.body.userName) {
                    return resolve({
                        success: false,
                        error: 'UserName is Mandatory'
                    })
                } else if (!req.body.userEmail) {
                    return resolve({
                        success: false,
                        error: 'UserEmail is Mandatory'
                    })
                }
                else if (!req.body.userPassword) {
                    return resolve({
                        success: false,
                        error: 'UserPassword is Mandatory'
                    })
                }
                else if (!req.body.userPhone) {
                    return resolve({
                        success: false,
                        error: 'UserPhone is Mandatory'
                    })
                }
                else if (!req.body.userRole) {
                    return resolve({
                        success: false,
                        error: 'userRole is Mandatory'
                    })
                }
                req.body.status = 1;
                req.body.createdDate = new Date();
                req.body.modifiedTime = new Date();
                let response = await studentInfo.createNewUser(req.body);
                return resolve(response);
            } catch (error) {
                reject(error)
            }
        })


    }

generateBase32Secret = () => {
        const buffer = crypto.randomBytes(15);
        const base32 = encode(buffer).replace(/=/g, "").substring(0, 24);
        return base32;
      };

    checkMFALoginUser(req) {
        return new Promise(async (resolve, reject) => {
            try {
                if (!req.body.userEmail) {
                    return resolve({
                        success: false,
                        error: 'UserEmail/UserPhoneNo is Mandatory'
                    })
                }

                else if (!req.body.userPassword) {
                    return resolve({
                        success: false,
                        error: 'UserPassword is Mandatory'
                    })
                }
               
                const checkLogin = req.body && req.body.userEmail ? req.body.userEmail : req.body.userPhone;
                let query = {
                    userEmail: checkLogin
                    //  userPassword : Buffer.from(req.body.userPassword).toString('base64')
                }
                let response = await studentInfo.loginUser(query);
                if (response.data.length == 0) {
                    return resolve({
                        sucess: false,
                        error: 'Invalid Credentials!'
                    })
                }
                else {
                    const base32_secret = generateBase32Secret();
                    response.secret = base32_secret;

                    let totp = new OTPAuth.TOTP({
                        issuer: "YourSite.com",
                        label: "YourSite",
                        algorithm: "SHA1",
                        digits: 6,
                        secret: base32_secret,
                    });

                    let otpauth_url = totp.toString();

                    QRCode.toDataURL(otpauth_url, (err) => {
                        if (err) {
                            return res.status(500).json({
                                status: 'fail',
                                message: "Error while generating QR Code"
                            })
                        }
                        res.json({
                            status: "success",
                            data: {
                                qrCodeUrl: qrUrl,
                                secret: base32_secret
                            }
                        })
                    })
                }
            } catch (error) {
                reject(error)
            }
        })
    }


    LoginUser(req) {
        return new Promise(async (resolve, reject) => {
            try {
                if (!req.body.userEmail) {
                    return resolve({
                        success: false,
                        error: 'UserEmail/UserPhoneNo is Mandatory'
                    })
                }
                else if (!req.body.userPassword) {
                    return resolve({
                        success: false,
                        error: 'UserPassword is Mandatory'
                    })
                }
                const checkLogin = req.body && req.body.userEmail ? req.body.userEmail : req.body.userPhone;
                let query = {
                    userEmail: checkLogin
                    //  userPassword : Buffer.from(req.body.userPassword).toString('base64')
                }
                let response = await studentInfo.loginUser(query);
                if (response.data.length == 0) {
                    return resolve({
                        sucess: false,
                        error: 'Invalid Credentials!'
                    })
                } else {
                    let token = global.jsonWebToken.sign(response.data[0], process.env.ACCESS_TOKEN_SECRET, {
                        expiresIn: 60 * 60 * 60 * 60 * 60 * 60 * 60,
                    });
                    let refreshtoken = global.jsonWebToken.sign(response.data[0], process.env.REFRESH_TOKEN_SECRET);
                    // response.status(200).json({ accessToken: token, refresh: refreshtoken });
                    return resolve({
                        success: true,
                        data: {
                            userName: response.data[0].userName,
                            expiresIn: response.data[0].expiresIn,
                            token: token,
                            refreshtoken: refreshtoken,
                            message: 'User successfully logged'
                        }
                    });
                }
            } catch (error) {
                reject(error)
            }
        })


    }

    getUser(req) {
        return new Promise(async (resolve, reject) => {
            try {
                if (!req.params.userName) {
                    return resolve({
                        success: false,
                        error: 'UserName is Mandatory!'
                    })
                }
                let query = {
                    userName: req.body.userName
                }
                let response = await studentInfo.loginUser(query);
                if (response.data.length == 0) {
                    return resolve({
                        sucess: false,
                        error: 'No Data Found!'
                    })
                } else {
                    return resolve(response);
                }
            } catch (error) {
                reject(error)
            }
        })


    }

}

module.exports = new UserController();