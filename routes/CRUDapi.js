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
        
        res.json({msg:'data fetched successfully',data: resp[0],user:user.userId,uName:user.userName})
    }).catch(err =>{
        console.log(err)
        res.json({msg:'error'})
    })
})

router.get('/getusers',(req,res)=>{

    db.execute('SELECT name FROM users').then(resp =>{
        
        res.json({msg:'data fetched successfully',data: resp[0]})
    }).catch(err =>{
        console.log(err)
        res.json({msg:'error'})
    })

})

router.get('/groupsin',(req,res)=>{

    let userDet = req.header('Authorization');

    let user = jwt.verify(userDet,process.env.JWT_TOKEN_SECRET);
    //console.log(user)
    db.execute('SELECT * FROM group_membrs WHERE user_name = ?',[user.userName]).then(resp =>{


        res.json({data:resp[0]});

    }).catch(err =>{ 
        //console.log(err)
      res.status(500).json({msg:'something went wrong'})
    })

})

module.exports = router;