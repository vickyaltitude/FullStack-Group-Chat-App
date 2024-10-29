const express = require('express');
const router = express.Router();
const path = require('path');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const db = require('../models/data');
require('dotenv').config();


router.get('/', (req,res)=>{

   let reqgrp = req.query.reqgrp
    let userDet = req.header('Authorization');

    let user = jwt.verify(userDet,process.env.JWT_TOKEN_SECRET);
   

    db.execute(`SELECT * FROM ${db.escapeId(reqgrp)}`).then( async resp =>{

        
        res.json({msg:'data fetched successfully',data: resp[0],user:user.userId,uName:user.userName})
    }).catch(err =>{
        console.log(err)
        res.json({msg:'error'})
    })
})



router.get('/getgroupslist',async (req,res)=>{

    let userDet = req.header('Authorization');

    let user = jwt.verify(userDet,process.env.JWT_TOKEN_SECRET);

    try{

        let groupsCreated = await db.execute('SELECT * FROM user_groups WHERE created_by =?',[user.userId]);

        res.json({groups_created:groupsCreated[0]})

    }catch(err){

        console.log(err)
        res.status(500).json({msg:'something went wrong'})
    }

    

     

})



router.get('/getusers',(req,res)=>{

    db.execute('SELECT name FROM users').then(resp =>{
        
        res.json({msg:'user fetched successfully',data: resp[0]})
    }).catch(err =>{
        console.log(err)
        res.json({msg:'error'})
    })

})

router.get('/groupsin',(req,res)=>{

    let userDet = req.header('Authorization');

    let user = jwt.verify(userDet,process.env.JWT_TOKEN_SECRET);
    
    db.execute('SELECT * FROM group_membrs WHERE user_name = ?',[user.userName]).then(resp =>{

          
        res.json({data:resp[0]});

    }).catch(err =>{ 
        //console.log(err)
      res.status(500).json({msg:'something went wrong'})
    })

})

module.exports = router;