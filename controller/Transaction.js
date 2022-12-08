const express = require('express');
const TransactionSchema = require('../models/tranSchema');
const jwt = require('jsonwebtoken');
const UserSchema = require('../models/regSchema');

// exports.GetMyTransaction = async (req, res) => {
// 	const { email } = req.body;
// 	const user = await UserSchema.findOne({ email: email });
// 	res.send(user);
   
// };


exports.GetMyTransaction = (req,res) => {
    res.send("Who is here ...")
}


