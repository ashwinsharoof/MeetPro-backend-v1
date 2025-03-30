const jwt = require('jsonwebtoken')
const config = require("config")
const adminauth = async(req,res,next)=>
{
    const token =
    req.headers["x-access-token"]
   
     if (!token) {
       return res.status(403).json({error:"A token is required for authentication"});
     }
    try 
    {
        const token = req.headers.x-access-token;
        // console.log("x-access-token",token);
        const decoded = jwt.verify(token,config.get("TOKEN_KEY"));
        // console.log("decode token",decoded.email);
        const user = decoded.email
        if(user !== "admin@gmail.com")
        {
            return res.status(401).json({error:"permission not granted"})
        }
    } 
    catch (error) {
        return res.status(401).json({error:"Invalid Token"});
    } 
    next();
}
module.exports = adminauth;