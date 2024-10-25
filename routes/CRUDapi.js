const express = require('express');
const router = express.Router();
const path = require('path');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const db = require('../models/data');
require('dotenv').config();

router.get('/',(req,res)=>{

    let userDet = req.header('Authorization');

    let user = jwt.verify(userDet,process.env.JWT_TOKEN_SECRET);
   

    db.execute('SELECT * FROM messages').then(resp =>{
        
        res.json({msg:'data fetched successfully',data: resp[0],user:user.userId})
    }).catch(err =>{
        console.log(err)
        res.json({msg:'error'})
    })
})

module.exports = router;