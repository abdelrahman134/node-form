const mongoose=require('mongoose')
const validator=require('validator')
const bcryptjs = require ('bcryptjs')
const userSchema = new mongoose.Schema({
  username: {
    type: String,
    require: true,
    trim: true,
  },
  password: {
    type: String,
    required: true,
    trim: true,
    minlength: 8,
    validate(value) {
      let password = new RegExp(
        "^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*])"
      );
      if (!password.test(value)) {
        throw new Error(
          "Password must include uppercase , lowercase , numbers , speacial characters"
        );
      }
    },
  },
  email: {
    type: String,
    require: true,
    trim: true,
    validate(val) {
      if (!validator.isEmail(val)) {
        throw new Error("EMAIL IS INVALID");
      }
    },
  },
  age: {
    type: Number,
    trim: true,
    default: 18,
    validate(val) {
      if (val <= 0) {
        throw new Error("AGE must be positive");
      }
    },
  },
});

userSchema.pre('save', async function(){
  const user=this
  if(user.isModified('password')){
    user.password = await bcryptjs.hash(user.password,8)
  }
})


userSchema.statics.findByCredentials = async (usern, pass) => {
  const user = await User.findOne({ username: usern});
  if (!user) {
    throw new Error("Unable to login");
  }

  const isMatch = await bcryptjs.compare(pass, user.password);

  if (!isMatch) {
    throw new Error("Unable to login");
  }
  return user;
};

const User=mongoose.model('User',userSchema)
module.exports=User




