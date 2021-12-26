const mongoose = require("mongoose");
const bcrypt = require('bcrypt');
const jwt= require('jsonwebtoken');

let schemaUser = mongoose.Schema({
    username: String,
    email: String,
    password: String
  });
  
  let url = "mongodb://localhost:27017/university";

  var User = mongoose.model("user", schemaUser);
  
  
  
  exports.register=(username, email, password)=>{
      return new Promise((resolve,reject)=>{
          mongoose.connect(url,{useNewUrlParser: true, useUnifiedTopology: true})
          .then(()=>{
              return User.findOne({email:email})
          }).then((doc)=>{
              if(doc){
                  mongoose.disconnect()
                  reject('this email already exists')
              }else{
                  bcrypt.hash(password,10).then((hashedPassword)=>{
                      let user= new User({
                          username:username,
                          email:email,
                          password:hashedPassword
                      })
                      user.save().then((user)=>{
                          mongoose.disconnect()
                          resolve(user)
                      }).catch((err)=>{
                          mongoose.disconnect()
                          reject(err)
                      })
                  }).catch((err)=>{
                    mongoose.disconnect()
                    reject(err)
                  })
              }
          })
      })
  }

  //login

  var privateKey= "This is my Secret Key"

  exports.login=(email, password)=>{
      return new Promise((resolve,reject)=>{
          mongoose.connect(url,{useNewUrlParser: true, useUnifiedTopology: true})
          .then(()=>{
              return User.findOne({email:email})
          }).then((user)=>{
              if(!user){
                  mongoose.disconnect()
                  reject('invalid email and password')
              }else{
                  bcrypt.compare(password,user.password).then((same)=>{
                      if(same){
                          //send token
                          let token= jwt.sign({id:user._id,username:user.username}, privateKey,{
                            expiresIn: '7d'
                          })
                          mongoose.disconnect()
                          resolve(token)
                      }else{
                          mongoose.disconnect()
                          reject('invalid email and password')
                      }
                  }).catch((err)=>{
                      mongoose.disconnect()
                      reject(err)
                  })
              }
          })
      })
  }