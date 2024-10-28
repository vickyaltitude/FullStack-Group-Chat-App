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
   
    let reqgrp = req.query.reqgrp
     let id = req.query.lastMsg;

    db.execute(`SELECT * FROM ${db.escapeId(reqgrp)} WHERE id > ?`,[Number(id)]).then(resp =>{
    
      
        res.json({data:resp[0],id:user.userId,name:user.userName})
     

    }).catch(err =>{
        console.log(err)
    })
    
})

module.exports = router