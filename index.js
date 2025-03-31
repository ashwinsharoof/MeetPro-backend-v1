require('dotenv').config()
const express = require("express");
const app  =  express();
const cors = require('cors')
const morgan = require("morgan")
const path = require("path")
const PORT = process.env.PORT||8080;
require('./config/mongoose');

const expertUser = require('./routes/expert-user');
const user = require('./routes/user');
const login = require('./routes/login');
const booking = require('./routes/booking');

app.use(cors()) // Cross-Origin Resource Sharing
app.use(express.json()) // for parsing application/json
app.use(express.urlencoded({ extended: true })) // for parsing application/x-www-form-urlencoded
app.use(morgan('dev'));

app.use('/api/v1/expert', expertUser);
app.use('/api/v1/user', user);
app.use('/api/v1/login', login);
app.use('/api/v1/booking', booking);

app.listen(PORT,()=>
    {
        console.log(`your application is running on port ${PORT}`);
    }
    
)