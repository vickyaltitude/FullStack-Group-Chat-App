const express = require('express');
const router = express.Router();
const path = require('path');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const db = require('../models/data');
require('dotenv').config();



module.exports = (io) =>{


    router.get('/',(req,res)=>{
        res.sendFile(path.join(__dirname,'..','public','chathome.html'))
    })

    io.on('connection',(socket)=>{

             
              socket.on('insertmsgtogrp',(data)=>{

                let userDet = data.jwtToken;
                let insertInto = data.insertgrp;
                let user = jwt.verify(userDet,process.env.JWT_TOKEN_SECRET);
               
                db.execute(`INSERT INTO ${db.escapeId(insertInto)} (user_id,name,message) VALUES(?,?,?)`,[user.userId,user.userName,data.msg]).then(resp =>{
                       
                    socket.emit('messageinsertionsuccessful',{msg :'message inserted successfully'});
            
                }).catch(err => {
                    console.log(err)
                    socket.emit('msginsertionfailed',{msg :'something went wrong'})
                    
                })
               

              })



    })
    
    

    return router
}
