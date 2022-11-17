var express = require('express');
const Auth = require('../controller/auth');
const { RegisterUser, GetUsers, SingleUser, LoginUser, Dashboard } = require('../controller/UserController');
var router = express.Router();
// const UserSchema = require("../models/reg")
// const bcrypt = require('bcrypt');
// const jwt = require('jsonwebtoken')

const secret = process.env.TOKEN_SECRET



//Single user fetch
router.get("/:id", SingleUser )

// Get all users
router.get('/', GetUsers);

//Register user
router.post('/', RegisterUser)



// User Login
router.post("/login", LoginUser);

router.get("/dashboard", Auth, (req,res) => {
    res.json({message: " Here is the dashboard"})
} )


module.exports = router;
