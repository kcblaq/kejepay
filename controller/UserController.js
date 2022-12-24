const UserSchema = require('../models/regSchema');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');
const nodemailer = require('nodemailer');
const { token } = require('morgan');
const OtpSchema = require('../models/otpSchema');

dotenv.config();

const secret = process.env.TOKEN_SECRET;
exports.SingleUser = async (req, res) => {
	const user = await UserSchema.findById(req.params.id);
	if (!user) {
		res.status(404).json({ message: 'User not found' });
		res.send('User not found');
	} else {
		res.status(200).json({ message: 'User found', data: user });
	}
};

exports.RegisterUser = async (req, res) => {
	const userExist = await UserSchema.exists({ email: req.body.email });
	if (userExist) {
		res.status(409).json({ message: 'User already exists' });
	} else {
		const encryptedPassword = await bcrypt.hash(req.body.password, 10);
		const user = new UserSchema({
			name: req.body.name,
			email: req.body.email,
			password: encryptedPassword,
			phone: req.body.phone,
			verified: false,
		});
		const token = jwt.sign({ email: user.email }, process.env.TOKEN_SECRET, {
			expiresIn: '2h',
		});
		await user.save();
		res.json({ message: 'User created', token, data: user });
	}
};

exports.GetUsers = async (req, res) => {
	try {
		const allUsers = await UserSchema.find();
		res.status(200).json({ message: 'Users found', data: allUsers });
	} catch (error) {
		res.send(error);
	}
};

exports.LoginUser = async (req, res) => {
	const { email, password } = req.body;
	const user = await UserSchema.findOne({ email });

	if (user) {
		const validPassword = await bcrypt.compare(password, user.password);
		if(user.verified !== true) return res.json({message:"Validate your email before login"})

		if (!validPassword) {
			res.status(403).json({ message: 'Wrong email or password' });
		} else {
			const token = jwt.sign({ _id: user.id, email: user.email }, secret, {
				expiresIn: '6h',
			});
			res.header('auth-token', token).json({ token, user });
		}
	} else {
		res.status(404).json({ message: 'User not found' });
	}
};

exports.Dashboard = async (req, res) => {
	res.send({ message: 'You must be authenticated to have accesses here...' });
};

const msgBody = `
<div>
    <h1> Welcome to Chequa, your reliable place for online transaction with peace </h1>
	<img src="https://pbs.twimg.com/profile_banners/1397931914850406406/1622239338/1500x500"
	alt="Kejepay Logo" style={{width:'100%'}} />
    <p> Here is your OTP verification code </p
</div>
`;

async function MailService({ to, body }) {
	// const {to} = req.body;
	var transporter = nodemailer.createTransport({
		host: 'kcblaq.com',
		port: 465,
		secure: true,
		auth: {
			user: process.env.EMAIL_USER,
			pass: process.env.EMAIL_PSWD,
		},
	});

	var mailOptions = {
		from: '"Chequa", <kelechi@kcblaq.com>',
		to: to,
		subject: 'Welcome to Chequa',
		html: body,
	};

	try {
		transporter.sendMail(mailOptions, function (error, info) {
			if (error) {
				console.log(error);
			} else {
				console.log('Email sent: ' + info.response);
			}
		});
	} catch (error) {
		console.log(error);
	}
}

exports.SendOTP = async (req, res) => {
	const { to } = req.body;
	const user = req.params.otp;

	const otp = Math.floor(1000 + Math.random() * 9000);
	const ifExist = await OtpSchema.find({ userId: user });

	body = `
	Here is your OTP <b> ${otp} </b>
	`;
	if (ifExist.length < 1) {
		const newOtp = new OtpSchema({
			userId: user,
			otp,
			expiresAt: Date.now() + 3600000,
		});
		MailService({ to, body });
		const data = jwt.sign({ user, otp }, secret, { expiresIn: '1h' });
		await newOtp.save();

		return res.json({
			otp: newOtp,
			message: 'OTP sent successfully',
			token: data,
		});
	} else {
		await OtpSchema.updateOne(
			{ userId: user },
			{
				otp: otp,
				userId: user,
				createdAt: Date.now(),
				expiresAt: Date.now() + 3600000 * 10000,
			}
		);
		MailService({ to, body });
		res.send('Updated ');
	}
};

exports.OTPVerify = async (req, res) => {
	const { otp } = req.body;
	const id = req.params.id;
	const userotp = await OtpSchema.find({ userId: id });
	const usertoverify = await UserSchema.find({ _id: id });
	if (!otp)
		return res.json({ message: 'Please supply OTP to verify your account' });
	if (userotp.length < 1) {
		return res.json({ message: 'Invalid user' });
	}
	const expire = userotp[0].expiresAt;

	if (expire < Date.now()) {
		return res.send('Token expired');
	}

	if (otp !== userotp[0].otp) {
		return res.json({ message: 'Invalid Token, try again' });
	} else {
		await UserSchema.updateOne({ _id: id }, { verified: true });
		return res.json({ message: 'Email has been validated' });
	}
};
