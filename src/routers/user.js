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
router.post("/login", async (req, res) => {
  try {
    const user = await User.findByCredentials(
      req.body.username,
      req.body.password
    );
 
    res.status(200).send({user});
  } catch (e) {
    res.status(400).send(e.message);
  }
});
router.get("/users", (req, res) => {
  User.find({})
    .then((users) => res.status(200).send(users))
    .catch((e) => res.status(400).send(e));
});
router.get('/users/:id',async(req,res)=>{
  try{
    const _id=req.params.id
    const user=await User.findById(_id)
    if(!user){
      throw new Error('can not find the user')
    }
    res.status(200).send(user)
  }catch(e){
    res.status(400).send(e)
  }
})
router.patch('/users/:id',async(req,res)=>{
  try{
    const _id=req.params.id
    const user=await User.findById(_id)
     if (!user) {
       return res.status(404).send("No user is found");
     }

    const update=Object.keys(req.body)
    update.forEach(ele=>user[ele]=req.body[ele])
  await  user.save()
    res.status(200).send(user)
  }catch(e){
    res.status(400).send(e)
  }
})

router.delete("/users/:id", async (req, res) => {
  try {
    const _id = req.params.id;
    const user = await User.findByIdAndDelete(_id);
    if (!user) {
      return res.status(404).send("Unable to find user");
    }
    res.status(200).send(user);
  } catch (e) {
    res.status(400).send(e);
  }
});
module.exports=router