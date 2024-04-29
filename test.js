// const express = require('express');
// const app = express();
// const cors =require ('cors');
// const jwt = require('jsonwebtoken');
// const port = 3000;


// app.use(cors());

// app.get('/test', ensureToken,(req, res) => {
//     jwt.verify(req.token,'my_secret_key',function(err,data){
//        if(err){
//         res.sendStatus(403);
//        }else{
//         res.json({
//             text:'This is Protected',
//             data:data
//         })
//        } 
//     })
// });

// app.post('/login',ensureToken,(req,res)=>{

//     const user ={id:3};
//     const token =jwt.sign({user},'my_secret_key')
//     res.json({
//       token:token
//     })
// })

// function ensureToken(req, res, next) {
//     const bearerHeader = req.headers['authorization'];
//     if (typeof bearerHeader !== 'undefined') {
//         const bearer = bearerHeader.split(" ");
//         if (bearer.length === 2) {
//             const bearerToken = bearer[1];
//             req.token = bearerToken;
//             next();
//         } 
//     } else {
//         res.sendStatus(403); 
//     }
// }


// app.listen(port, () => {
//     console.log(`Server listening at http://localhost:${port}`);
// });