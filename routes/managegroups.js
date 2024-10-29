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

router.post('/addusers', async (req, res) => {
    let cur_grp = req.query.addto;
    let userLi = req.body.usersLi;

    if (!Array.isArray(userLi) || userLi.length === 0) {
        return res.status(400).json({ msg: 'Invalid users list' });
    }


    try {
       
        await Promise.all(userLi.map(user => {
            return db.execute('INSERT INTO group_membrs (user_name, group_name) VALUES (?, ?)', [user, cur_grp]);
        }));

        return res.json({ msg: 'Users inserted successfully' });
    } catch (err) {
        console.error(err);
        return res.status(500).json({ msg: 'Something went wrong' });
    }
});

router.post('/remusers', async (req, res) => {
    let curr_grp = req.query.remfrm;
    let userLis = req.body.usersLiRem;

    if (!Array.isArray(userLis) || userLis.length === 0) {
        return res.status(400).json({ msg: 'Invalid users list' });
    }

    console.log(curr_grp,userLis);

    try {
       
        await Promise.all(userLis.map(user => {
            return db.execute('DELETE FROM group_membrs WHERE user_name = ? AND group_name = ?', [user, curr_grp]);
        }));

        return res.json({ msg: 'Users removed successfully' });
    } catch (err) {
        console.error(err);
        return res.status(500).json({ msg: 'Something went wrong' });
    } 
});

router.post('/leaveusers',async (req,res)=>{
    let curr_grp = req.query.levfrm;
    let userLis = req.body.userL;

    try{
        await db.execute('DELETE FROM group_membrs WHERE user_name = ? AND group_name = ?', [userLis, curr_grp]);
    }catch(err){
           console.log(err);
           res.status(500).json({msg:'something went wrong'})

    }

    return res.json({msg:'user left successfully'})
 
})


router.get('/deletegrp',async (req,res)=>{

    let dltGrp= req.query.dltgrp
        
    try{
        await db.execute('DELETE FROM group_membrs WHERE group_name = ?',[dltGrp])

        await db.execute('DELETE FROM user_groups WHERE group_name = ?',[dltGrp])

        await db.execute(`DROP TABLE IF EXISTS \`${dltGrp}\``);

        console.log(`Table ${dltGrp} dropped successfully.`);

        res.json({msg:'group deleted successfully'})
    }catch(err){
       
        res.status(500).json({msg:'something went wrong'})
    }

})



module.exports = router;