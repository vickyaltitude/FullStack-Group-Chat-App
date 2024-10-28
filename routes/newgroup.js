const express = require('express');
const router = express.Router();
const path = require('path');
const jwt = require('jsonwebtoken');
const db = require('../models/data');


router.post('/',(req,res)=>{
     
    let incomeDat = req.body;
    let userDet = req.header('Authorization');
    
    let user = jwt.verify(userDet,process.env.JWT_TOKEN_SECRET);
    

    db.execute('INSERT INTO `user_groups` (group_name,created_by) VALUES(?,?)',[incomeDat.getGrpName,user.userId]).then( async resp =>{
       
        const createTableQuery = `
        CREATE TABLE ${db.escapeId(incomeDat.getGrpName)} (
            id INT UNSIGNED NOT NULL AUTO_INCREMENT,
            user_id INT NOT NULL,
            name VARCHAR(255) NOT NULL,
            message VARCHAR(255) DEFAULT NULL,
            created_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            PRIMARY KEY (id)
        )`;
    
    await db.execute(createTableQuery);

   await db.execute(`INSERT INTO ${db.escapeId(incomeDat.getGrpName)} (user_id,name,message) VALUES(?,?,'Created this group')`,[user.userId,user.userName,])

        db.execute('SELECT * FROM `user_groups` WHERE group_name = ?',[incomeDat.getGrpName]).then(resp =>{
       
            incomeDat.selectedMembers.forEach(user =>{

                db.execute('INSERT INTO `group_membrs` (user_name,group_name) VALUES(?,?)',[user,resp[0][0].group_name])
            })
            

        }).catch(err => console.log(err))

        

       res.json({msg:'new group created successfully'});
        

    }).catch(err => {
        
        console.log(err)
        res.status(404).json({msg:'duplicate entry'});
    
    })
    
})

module.exports = router