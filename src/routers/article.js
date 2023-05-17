const express=require("express")
const router=express.Router()
const Article=require("../models/article")
const auth=require("../middlewar/authentication")
router.post("/article",auth,async(req,res)=>{
    try{
        const article=new Article({...req.body,owner:req.user._id})
        await article.save()
        res.status(200).send(article)
}catch(e){
    res.status(400).send(e)
}
})
router.get("/article",auth,async(req,res)=>{
    try{
        const article=await Article.find({})
        res.status(200).send(article)
    }catch(e){
        res.status(400).send(e)
    }
})
router.get("/article/:id",auth,async(req,res)=>{
    try{
        const id=req.params.id
        const article=await Article.findOne({_id:id,owner:req.user.id})
        if(!article){
            throw new Error("can't find the article")
        }
        res.status.send(article)
    }catch(e){
        res.status(400).send(e)
    }

})
router.patch("/article/:id",auth,async(req,res)=>{
    try{
        const id = req.params.id;
        const article = await Article.findByIdAndUpdate({ _id }, req.body, {
          new: true,
          runvalidators: true,
        });
        if (!article) {
          throw new Error("can't find the article");
        }
        res.status.send(article);

    }catch(e){
        res.status(400).send(e);
        
    }
})
router.delete("/article/:id", auth, async (req, res) => {
  try {
    const article = await Task.findByIdAndDelete(req.params.id);
    if (!article) {
      res.status(404).send("No article is found");
    }
    res.status(200).send(article);
  } catch (e) {
    res.status(500).send(e.message);
  }
});
module.exports=router