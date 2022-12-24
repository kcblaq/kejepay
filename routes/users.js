var express = require('express');
const Auth = require('../controller/auth');
// const MailServe = require('../utils/mailService')
const { RegisterUser, GetUsers, SingleUser, LoginUser, Dashboard, SendOTP, OTPVerify } = require('../controller/UserController');
var router = express.Router();

const secret = process.env.TOKEN_SECRET

router.get("/dashboard", Auth,  (req,res) => {
    res.json({message: " Here is the dashboard"})
} )

//Single user fetch
router.get("/:id", SingleUser )

// Get all users
router.get('/', GetUsers);

//Register user

// router.get('/mail', MailService)


// User Login
router.post("/login", LoginUser);

router.post('/', RegisterUser)

router.post('/otp/:otp', SendOTP)
router.post('/otp-verify/:id', OTPVerify)


module.exports = router;
