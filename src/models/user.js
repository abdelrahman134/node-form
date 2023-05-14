const mongoose=require('mongoose')
const validator=require('validator')
const jwt=require('jsonwebtoken')
const bcryptjs=require('bcryptjs')
const userSchema=mongoose.Schema({
  username:{
    type:String,
    required:true,
    trim:true
  },
  password:{
    type:String,
    trim:true,
    required:true,
    validate(val){
      const password=  new RegExp("^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\$%\^&\*])");
      if(!password.test(val)){
       throw new Error ('the apssword must contain upper and lower case letter')
      }
    }
  },
email:{
  type:String,
  required:true,
  trim:true,
  validate(val){
    if(!validator.isEmail(val)){
       throw new Error ('THIS EMAIL IS INVALID')
    }
  }
},
age:{
  type:Number,
  default:18,
  validate(val){
    if(val<=0){
      throw new Error('the age must greater than 0')
    }
  }
},
tokens:[{
  type:String,
  required:true
}]

})
userSchema.pre('save',async function(){
  const user=this
  if(user.isModified('password')){
    user.password=await bcryptjs.hash(user.password,8)
  }
} )

userSchema.statics.findByCredentials=async (em,pass)=>{
  const user= await User.findOne({email:em})
  if(!user){
    throw new Error('can not find the user')
  }
  const isMatch = await bcryptjs.compare(pass,user.password)
  if(!isMatch){
    throw new Error('the password of email do not match')
  
  }
  return user
};
userSchema.methods.generateToken=async function(){
 const user=this
 const token =jwt.sign({_id:user._id.toString},"token200")
 user.tokens=user.tokens.concat(token) 
 await user.save()
 return token
}
userSchema.methods.toJSON= function(){
  const user=this
  const userObject = user.toObject()
  delete userObject.password
  delete userObject.tokens
  return userObject
}

const User =mongoose.model("User",userSchema)
module.exports = User