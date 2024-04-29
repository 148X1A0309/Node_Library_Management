
const express = require("express")
const cors = require('cors');
const morgan = require("morgan"); //1
const fs = require("fs");   //2
const path = require("path");  //3
const params = require('./config/params');
global.jsonWebToken = require("jsonwebtoken");

const { port } = process.env.NODE_PORT || require("./config/params");
const app = express();
app.use(cors());
app.use(morgan("dev"));
app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ limit: "16mb", extended: true, parameterLimit: 50000 }));
app.use((req, res, next) => {
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader(
        "Access-Control-Allow-Methods",
        "GET, POST, PUT, PATCH, DELETE, OPTIONS"
    );
    res.setHeader(
        "Access-Control-Allow-Headers",
        "X-Requested-With, content-typeAccept, Authorization, authKey"
    );
    res.setHeader("Access-Control-Allow-Credentials", true);
    next();
});

(async function () {
    // Code for connecting to Database
    const dbConn = require('./config/mgConn');
    global.dbs = await dbConn.connect();

    //Code to check the list of Collections in the Database
    // const db = global.dbs.library;
    // const collections = await db.listCollections().toArray();
    global.appRoot = path.resolve(__dirname); //5

    global.customJWTVerifier = function (req, res, next) {
        if (req.headers["Auth_Token"]) {
            let token = req.headers["authorization"].split("Bearer ")[1];
            jsonWebToken.verify(token,process.env.ACCESS_TOKEN_SECRET , (err, user) => {
                if (err) {
                    console.log(err);
                    res.status(200).json({
                        success: false,
                        error: err.message
                    });
                } else {
                    req.user = user;
                    next();
                }
            });
        } else {
            return res.status(200).json({
                success: false,
                error: "Authorization Token is Missing"
            });
        }
    };

    app.use("/v1.0", require("./v1.0/routes/initRoute"));

    app.use((req, res, next) => {
        let error = new Error("Not found endpoint");
        error.status = 400;
        next(err);
    });
    app.use((error, req, res, next) => {
        res.status = error.status || 500;
        res.json({
            error: error.message,
        });
    });

    app.listen(port);
    console.log(`Server Listening on port ${port} ...`);
})();