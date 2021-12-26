const route = require('express').Router()
const studentModel= require('../models/student.model')
const jwt= require('jsonwebtoken');



route.get('/',(req,res,next)=>{
    res.send('melcome from bary')
})


//verify token for users
var privateKey= "This is my Secret Key"

verifyToken=(req,res,next)=>{
    let token = req.headers.authorization
    if(!token){
        res.status(400).json({msg:"access rejected.....!"})
    }

    try{
        jwt.verify(token,privateKey)
        next()
    }catch(e){
        res.status(400).json({msg:e})
    }
}


//verify token for admin
verifyTokenAdmin=(req,res,next)=>{
    let token= req.headers.authorization
    let role=req.headers.role
    if(!token || role!='Admin'){
        res.status(400).json({msg: 'Access Rejected........!'})
    }

    try{
        jwt.verify(token,privateKey)
        next()
    }catch(e){
        res.status(400).json({msg:e})
    }
}

var secretKey=process.env.SECRET_KEY
var clientKey=process.env.CLIENT_KEY

verifySecretClient=(req,res,next)=>{
    let sk= req.params.secret
    let ck= req.params.client

    if(sk==secretKey && ck == clientKey){
        next()
    }else{
        res.status(400).json({error: "you can't access to this route because u don't sent me secret key and client key"})
    }
}


route.post('/addstudent',verifyTokenAdmin,verifySecretClient,(req,res,next)=>{
    studentModel.postNewStudent(req.body.firstname, req.body.lastname, req.body.email, req.body.age, req.body.phone)
    .then((doc)=>res.status(200).json(doc))
    .catch((err)=>res.status(400).json(err))
})

route.get('/students',verifyToken,verifySecretClient,(req,res,next)=>{
        studentModel.getAllStudents()
        .then((doc)=>res.status(200).json(doc))
        .catch((err)=>res.status(400).json(err))
})
/* route.get('/students',verifyToken,(req,res,next)=>{
        let token = req.headers.authorization
        let user= jwt.decode(token,{complete:true})
        studentModel.getAllStudents()
        .then((doc)=>res.status(200).json({students:doc,user:user}))
        .catch((err)=>res.status(400).json(err))
}) */
route.get('/student/:id',verifyToken,verifySecretClient,(req,res,next)=>{
    studentModel.getOneStudent(req.params.id)
    .then((doc)=>res.status(200).json(doc))
    .catch((err)=>res.status(400).json(err))
})
/* route.get('/student/:firstname',(req,res,next)=>{
    studentModel.getOneStudent(req.params.firstname)
    .then((doc)=>res.status(200).json(doc))
    .catch((err)=>res.status(400).json(err))
}) */

route.delete('/student/:id',verifyTokenAdmin,verifySecretClient,(req,res,next)=>{
    studentModel.deleteOneStudent(req.params.id)
    .then((doc)=>res.status(200).json(doc))
    .catch((err)=>res.status(400).json(err))
})
route.patch('/student/:id',verifyTokenAdmin,verifySecretClient,(req,res,next)=>{
    studentModel.updateOneStudent(req.params.id, req.body.firstname, req.body.lastname, req.body.email, req.body.age, req.body.phone)
    .then((doc)=>res.status(200).json(doc))
    .catch((err)=>res.status(400).json(err))
})

module.exports=route