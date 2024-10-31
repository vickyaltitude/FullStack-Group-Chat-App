const express = require('express');
const router = express.Router();
const path = require('path');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const db = require('../models/data');
require('dotenv').config();


module.exports = (io) =>{
  
    io.on('connection',(socket)=>{


        socket.on('chatmessagesgetmessages',(data)=>{

                    let reqgrp = data.reqgrp
                    let userDet = data.jwtToken;
                    let user = jwt.verify(userDet,process.env.JWT_TOKEN_SECRET);
                    console.log(user)

            db.execute(`SELECT * FROM ${db.escapeId(reqgrp)}`).then( async resp =>{

                
                socket.emit('messagesgotfromDB',{msg:'data fetched successfully',Msgdata: resp[0],user:user.userId,uName:user.userName})

            }).catch(err =>{

                console.log(err)

                socket.emit('erroringettingmsg',{msg:'error'})
            })

        })

        socket.on('getgroupslist',async (data)=>{

            let userDet = data.jwtToken;

            let user = jwt.verify(userDet,process.env.JWT_TOKEN_SECRET);
      
            try{
        
                let groupsCreated = await db.execute('SELECT * FROM user_groups WHERE created_by =?',[user.userId]);
        
                socket.emit('usergrpsfetchsuccess',{groups_created:groupsCreated[0]})
        
            }catch(err){
        
                console.log(err)
                socket.emit('errorwhilefetchinggrpslist',{msg:'something went wrong'})
            }
        

        })


       socket.on('getusers',(data)=>{

                   let userDet = data.jwtToken

                    let user = jwt.verify(userDet,process.env.JWT_TOKEN_SECRET);
        
                db.execute('SELECT name FROM users WHERE name != ?',[user.userName]).then(resp =>{
                    
                    socket.emit('userslistfetchsuccess',{msg:'user fetched successfully',Userdata: resp[0]})
                }).catch(err =>{
                    console.log(err)
                    socket.emit('errowhilefetchusers',{msg:'error fetching users'})
                })

       })


       socket.on('groupsin',(data)=>{

                        
                    let userDet = data.jwtToken

                    let user = jwt.verify(userDet,process.env.JWT_TOKEN_SECRET);
                    
                    db.execute('SELECT * FROM group_membrs WHERE user_name = ?',[user.userName]).then(resp =>{

                        
                        socket.emit('usermemberin',{grpdata:resp[0]});

                    }).catch(err =>{ 
                        //console.log(err)
                        socket.emit('errorwhilefetchusersgrps',{msg:'something went wrong'})
                    })


       })


    })

    return router

}

