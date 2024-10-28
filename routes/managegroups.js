const express = require('express');
const router = express.Router();
const path = require('path');
const jwt = require('jsonwebtoken');
const db = require('../models/data');
require('dotenv').config();




router.get('/userstoadd',async (req,res)=>{


    let allUsers = await db.execute('SELECT * FROM users');
    let grpmembers = await db.execute('SELECT * FROM `group_membrs` WHERE group_name = ?',[req.query.gusers])
    let allUsersArr = allUsers[0].map(users => users.name);
    let grpmembersArr = grpmembers[0].map(mem => mem.user_name);
    const result = allUsersArr.filter(element => !grpmembersArr.includes(element));

    res.json({msg:'user fetched successfully',usersToAdd:result});
})

router.get('/userstoremove',async (req,res)=>{

    let grpmembers = await db.execute('SELECT * FROM `group_membrs` WHERE group_name = ?',[req.query.gusers]);
    let membersArr = grpmembers[0].map(user => user.user_name);
    res.json({msg:'user fetched',usersToRem:membersArr})
})



module.exports = router;