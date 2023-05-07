const express=require('express')
const app=express()
const port=3000
require('./db/mongoose')
app.use(express.json())
const router=require('./routers/user')
app.use(router)
app.listen(port, () => {
  console.log("All Done Successfully");
});