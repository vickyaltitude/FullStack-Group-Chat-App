const express = require('express');
const router = express.Router();
const path = require('path');
const bcrypt = require('bcrypt');
const db = require('../models/data');


router.get('/',(req,res)=>{
    res.sendFile(path.join(__dirname,'..','public','signup.html'))
})

router.post('/insertnewuser',(req,res)=>{
     const receivedUserData = req.body;
     let userName = receivedUserData.uName;
     let userEmail = receivedUserData.uEmail;
     let userPhone = receivedUserData.uPhone;
     let userPassword = receivedUserData.uPassword;
console.log(receivedUserData)
     bcrypt.hash(userPassword,10,(err,hash)=>{
        if(err){
            console.log(err)
        }else{
                db.execute('INSERT INTO users (name,email,phone,password) VALUES(?,?,?,?)',[userName,userEmail,userPhone,hash]).then(resp =>{
                        
                      let insertid = resp[0].insertId ;
                      let message = `${userName} joins the chat`

            db.execute('INSERT INTO messages (id,name,message) VALUES(?,?,?)',[insertid,userName,message]).then(resp =>{

                res.status(201).json({msg:'message inserted successfully'})

            }).catch(err => console.log(err))
                       
                    
                    
                }).catch(err => {
                    if(err.code == 'ER_DUP_ENTRY'){

                        res.status(401).json({msg:'user already exists'})

                    }else{
                        console.log(err)
                    }
                })
        }
     })
    
    
})

module.exports = router