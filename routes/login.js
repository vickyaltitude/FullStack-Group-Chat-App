const express = require('express');
const router = express.Router();
const path = require('path');
const bcrypt = require('bcrypt');
const db = require('../models/data');
const generatedToken = require('../util/jwt');


router.get('/',(req,res)=>{
    res.sendFile(path.join(__dirname,'..','public','login.html'));
})

router.post('/',(req,res)=>{

    let receivedCred = req.body;
    let userEmail = receivedCred.getEmail;
    let userPassword = receivedCred.getPassword;
    
    db.execute('SELECT*FROM users WHERE email=?',[userEmail]).then(resp =>{
        let dataFromDB = resp[0]
          
          if(dataFromDB.length == 0){
            res.status(404).json({msg:'user email not found'})
          }else if(dataFromDB.length){
            bcrypt.compare(userPassword,dataFromDB[0].password,(err,result)=>{

                if(err){
                    res.status(500).json({msg:'something went wrong'})
                    console.log('error')
                }else if(result == true){
                    console.log('success')
                    res.status(200).json({msg:'user login successfull',userId: generatedToken.encryptuserid(dataFromDB[0].id,dataFromDB[0].name)})
                }else{
                    console.log('errormsg')
                    res.status(401).json({msg:'entered password is incorrect'})
                }

            })
          }

         

    }).catch(err => console.log(err))
})

module.exports = router;