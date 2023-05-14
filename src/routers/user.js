const express = require("express");
const router = express.Router();
const User = require("../models/user");
router.post("/users", (req, res) => {
  const user = new User(req.body);
  user
    .save()
    .then((user) => res.status(200).send(user))
    .catch((e) => res.status(400).send(e));
});
router.get("/users", (req, res) => {
  User.find({})
    .then((user) => res.status(200).send(user))
    .catch((e) => res.status(400).send(e));
});
router.get("/users/:id",async(req,res)=>{
  try{
    const _id=req.params.id
     const user=await User.findById(_id)
     if(!user){
      throw new Error ("can not find the user")

     }
     res.status(200).send(user)
  }catch(e){
    res.status(400).send(e)
  }
})
router.patch("/users/:id",async(req,res)=>{
  try{
    const _id=req.params.id
    const updates=Object.keys(req.body)
    const user=await User.findById(_id)
    if(!user){
      throw new Error ("the user is invalid")
    }
    updates.forEach(ele=>user[ele]==req.body[ele])
    user.save()
    req.status(200).send(user)
  }catch(e){
    res.status(400).send(e)
  }
})

router.delete("/users/:id",async(req,res)=>{
  try {
     const _id=req.params.id
     const user=await User.findByIdAndDelete(_id)
     if(!user){
      throw new Error("wrong id")
     }
res.status(200).send(user)
  } catch (e) {
    res.status(400).send(e);
  }
})

router.post("/login",async(req,res)=>{
  try {
     const user = await User.findByCredentials(req.body.email,req.body.password);
     const token = await user.generateToken();
     user.save()
     res.status(200).send([user,token])
  } catch (e) {
    res.status(400).send(e);
  }
})
router.post("/users",async(req,res)=>{
  try{
     const user=new User(req.body)
     const token=await user.generateToken()
     user.save()
     res.status(200).send(user)
  }catch(e){

  }
})
router.post("/logout", async (req, res) => {
  try {
    req.body.tokens = req.body.tokens.filter((token) => {
      return token.token !== req.token;
    });
    await req.body.save();
    res.status(200).send();
  } catch (e) {
    res.status(400).send(e);
  }
});

module.exports=router
