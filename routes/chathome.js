const express = require('express');
const router = express.Router();
const path = require('path');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const db = require('../models/data');
require('dotenv').config();


router.get('/',(req,res)=>{
    res.sendFile(path.join(__dirname,'..','public','chathome.html'))
})


router.post('/',(req,res)=>{
  
    let userMsg = req.body;
    let userDet = req.header('Authorization');
    
    let user = jwt.verify(userDet,process.env.JWT_TOKEN_SECRET);
   console.log(8)
    db.execute('INSERT INTO messages (user_id,name,message) VALUES(?,?,?)',[user.userId,user.userName,userMsg.msg]).then(resp =>{
           
        res.json({msg :'message inserted successfully'});

    }).catch(err => {
        res.status(500).json({msg :'something went wrong'})
        console.log(err)
    })
   

})

module.exports = router;