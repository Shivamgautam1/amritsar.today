const express = require('express');
const app = express();
const mysql = require('mysql');
const bodyParser = require('body-parser');
const cors = require('cors');
const config = require('./config/database');

//Creating connection to mySQL database
const con = mysql.createConnection({
    host:config.host,
    user:config.user,
    password:config.password,
    database:config.database
});

//Connect to database
con.connect((err)=>{
    if(err){
        console.log('error connecting to database');
    }
    console.log('Connected to Database '+config.database);
})

app.use(cors());
app.use(bodyParser.json());

const data = require('./routes/data');
const sensor = require('./routes/sensor');
app.use('/data',data);
app.use('/sensor',sensor);
app.get('/',(req,res)=>{
    res.send('API Amritsar.today');
});

var server = app.listen(80,()=>{
    console.log('App running on http://localhost:80');
})