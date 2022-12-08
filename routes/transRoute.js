const express = require('express')
const TransSchema = require("../models/tranSchema")
const router = express.Router()
const GetMyTransaction = require("../controller/Transaction")
const UserSchema = require("../models/regSchema")
const token = require("../controller/auth")
const Auth = require("../controller/auth")
const jwt = require("jsonwebtoken")
const dotenv = require("dotenv")
const { resolve } = require('path')
dotenv.config()


router.get("/", Auth, async(req,res) => {
   const allTrans = await TransSchema.find()
   const token = req.headers.token
   const email = jwt.verify(token, process.env.TOKEN_SECRET).email
   console.log(email)
   res.send(allTrans)
   
})

router.post("/",Auth, (req,res) => {
    const { party,amount, description, terms , category, duration,status} = req.body

    const initiator = jwt.verify(req.headers.token, process.env.TOKEN_SECRET).email

    if( !party || !terms || !amount || !duration)  {
        res.status(400).json({message:"Please ensure you fill all required fields"})
    }
    
    const newTrans = new TransSchema({
        initiator,
        party,
        amount,
        description,
        terms,
        category,
        duration,
        status
    })
    try {
        
        if(newTrans) newTrans.save()
    res.status(200).json({message: "Transaction successfully created", data: newTrans})
    } catch (error) {
        res.json({message:`${error}  saving the transaction `})
    }
    
})

// The transactions initiated by a user
router.get("/personal", async(req,res) => {
const {email, phone} = req.body
const initiator = jwt.verify(req.headers.token, process.env.TOKEN_SECRET).email
const mytrans = await TransSchema.find({initiator: initiator})
res.status(200).json({message:"Success", data:mytrans})

})

// The transactions a user is a party to
router.get("/party", async(req,res) => {
    const {email, phone} = req.body
    const userEmail = jwt.verify(req.headers.token, process.env.TOKEN_SECRET).email
    const mytrans = await TransSchema.find({party: userEmail})
    res.status(200).json({message:"Success", data:mytrans})
    
    })

router.get("/closed", async(req,res) => {
    const userEmail = jwt.verify(req.headers.token, process.env.TOKEN_SECRET).email
    const trans = await TransSchema.find({initiator: userEmail , status:"CLOSED" } || {party: userEmail, status:"CLOSED"}) 
    res.send(trans)
})  

module.exports = router;


