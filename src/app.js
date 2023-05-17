const express=require('express')
const app=express()
const port=3000
require('./db/mongoose')
app.use(express.json())
const userRouter=require('./routers/user')
const articleRouter = require("./routers/article");

app.use(articleRouter);

app.use(userRouter)
app.listen(port, () => {
  console.log("All Done Successfully");
});