const express = require('express')
const app = express();
const fs = require('fs');
const path = require('path');
const bodyParser = require('body-parser');
const cors = require('cors')
const PORT = process.env.PORT || 7878;

app.use(express.static(path.join(__dirname,'public')));
app.use(express.static(path.join(__dirname,'views')));
app.use(bodyParser.urlencoded({extended:true}));
app.use(express.json());

app.use(cors({
    origin: 'http://43.204.237.132',
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    credentials: true
}));

const signUp = require('./routes/signup');
const logIn = require('./routes/login')
const chatHome = require('./routes/chathome');


app.use('/',signUp);

app.use('/login',logIn);

app.use('/chathome',chatHome);



app.listen(PORT,()=> console.log(`PORT SUCCESSFULLY RUNNING ON PORT ${PORT}`));