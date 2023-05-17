const User=require("../models/user")
const jwt=require("jsonwebtoken")
const authentication=async(req,res,next)=>{
  try{
        const token = req.header('Authorization').replace('Bearer ','')
        console.log(token);
        const decode = jwt.verify(token, "token200");
        console.log(decode);
        const user = await User.findOne({_id:decode._id,tokens:token})
        console.log(user);
        if(!user){

         throw new Error("there is an error in token")
        }
        req.user = user
        req.token = token
        next()
    }
    catch(e){
        res.status(400).send({error:'Please authenticate'})
    }
}
module.exports=authentication