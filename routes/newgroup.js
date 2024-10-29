const express = require('express');
const router = express.Router();
const path = require('path');
const jwt = require('jsonwebtoken');
const db = require('../models/data');


router.post('/', async (req, res) => {
    try {
        let incomeDat = req.body;
        let userDet = req.headers['authorization']; 
        let user = jwt.verify(userDet, process.env.JWT_TOKEN_SECRET);

      
        const resp = await db.execute('INSERT INTO `user_groups` (group_name, created_by) VALUES(?, ?)', [incomeDat.getGrpName, user.userId]);

        // Create table for the group
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


        await db.execute(`INSERT INTO ${db.escapeId(incomeDat.getGrpName)} (user_id, name, message) VALUES(?, ?, 'Created this group')`, [user.userId, user.userName]);

       
        const groupResult = await db.execute('SELECT * FROM `user_groups` WHERE group_name = ?', [incomeDat.getGrpName]);
        const groupName = groupResult[0][0].group_name;

        for (const member of incomeDat.selectedMembers) {
            await db.execute('INSERT INTO `group_membrs` (user_name, group_name) VALUES(?, ?)', [member, groupName]);
        }

        res.json({ msg: 'New group created successfully' });

    } catch (err) {
        console.error(err);
        if (err.code === 'ER_DUP_ENTRY') {
            return res.status(409).json({ msg: 'Duplicate entry' }); 
        }
        res.status(500).json({ msg: 'Something went wrong' });
    }
});

module.exports = router