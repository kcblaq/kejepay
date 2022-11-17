const UserSchema = require("../models/reg");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const dotenv = require('dotenv')
dotenv.config()

const secret = process.env.TOKEN_SECRET;
exports.SingleUser = async(req,res) => {
    const user = await UserSchema.findById(req.params.id)
    if(!user){
        res.status(404).json({message:"User not found"})
        res.send("User not found")
    } else {
        
        res.status(200).json({message:"User found", data: user})
    }
}

exports.RegisterUser = async(req,res) => {
    const userExist = await UserSchema.exists({email: req.body.email})
    if(userExist){
      res.status(409).json({message:"User already exists"})
    } else{
        const encryptedPassword = await bcrypt.hash(req.body.password, 10)
      const user = new UserSchema({
        name: req.body.name,
        email: req.body.email,
        password: encryptedPassword,
        phone: req.body.phone
      })
      const token = jwt.sign({email: user.email}, process.env.TOKEN_SECRET, {expiresIn: "2h"})
      await user.save()
      res.json({message:"User created",token, data: user})
    }
}

exports.GetUsers = async(req,res) => {
    try {
        const allUsers = await UserSchema.find();
        res.status(200).json({message:"Users found", data: allUsers})
    } catch (error) {
        res.send(error)
    }
}

exports.LoginUser = async(req,res) =>{
    const {email,password} = req.body
  const user = await UserSchema.findOne({email})
  
    if(user){
        const validPassword = await bcrypt.compare(password, user.password)
        
        if(!validPassword) {
            res.status(403).json({message:"Wrong email or password"})
        } else {
            const token = jwt.sign({_id: user.id,email: user.email}, secret, {expiresIn: '3h'})
            res.header("auth-token", token).json({token, user})
        }
    } else {
        res.status(404).json({message:"User not found"})
    }
}

exports.Dashboard = async(req,res) =>{
    res.send({message: "You must be authenticated to have accesses here..."})
}