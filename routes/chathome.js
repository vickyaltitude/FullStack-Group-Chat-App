const express = require('express');
const router = express.Router();
const path = require('path');
const bcrypt = require('bcrypt');
const db = require('../models/data');


router.get('/',(req,res)=>{
    res.sendFile(path.join(__dirname,'..','public','chathome.html'))
})


module.exports = router;