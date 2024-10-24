const express = require('express')
const app = express();
const fs = require('fs');
const path = require('path');
const bodyParser = require('body-parser');
const PORT = process.env.PORT || 7878;

const signUp = require('./routes/signup')

app.use(express.static(path.join(__dirname,'public')));
app.use(bodyParser.urlencoded({extended:true}));

app.use('/',signUp);



app.listen(PORT,()=> console.log(`PORT SUCCESSFULLY RUNNING ON PORT ${PORT}`));