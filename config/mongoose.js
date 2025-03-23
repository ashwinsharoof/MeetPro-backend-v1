  // connecting to database
  require('dotenv').config()
  const mongoose = require('mongoose')
  mongoose.connect(process.env.MONGO_CONNECTION_STRING).then(()=>{
    console.log("DB Connected");
  }).catch((err)=>{
    console.log(err);
  })