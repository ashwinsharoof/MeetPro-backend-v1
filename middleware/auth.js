const jwt = require('jsonwebtoken')
const config = require("config")
// const adminschema = require('../schemas/admin')
const auth  = async(req,res,next)=>
{
    //solution 1
//    try
//    {
//     const token =  req.header('Authorization').split(" ")[1]
//     //    const token2 = token.split(" ")[1];
//     // console.log("token",token);
       
//        const decode = jwt.verify(token,process.env.TOKEN_KEY)
//        req._id = decode._id; // get user id 
//        console.log("req.id",req._id);
//        const user = await adminschema.findOne({_id : decode._id, "token": token })

//        if(!user)
//        {
//            throw new Error ()
//        }
//        req.token = token;
//        req.user = user;
//        next()

//    }
//    catch(e)
//    {
//     // console.log(e);
//     res.status(401).send({error : "Protected API"})

//    }


// solution 2
 const token = req.headers["x-access-token"]
console.log("token",req.headers)
  if (!token) {
    return res.status(403).json({error:"A token is required for authentication"});
  }
  try {
    const decoded = jwt.verify(token, config.get("TOKEN_KEY"));
    req.user = decoded;
    // console.log(req.user,"getting user from token");
  } catch (err) {
    return res.status(401).json({error:"Invalid Token"});
  }
  return next();
}
module.exports = auth;