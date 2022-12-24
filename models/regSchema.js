const mongoose = require('mongoose');


const RegSchema = new mongoose.Schema({
	name: {
		type: String,
		required: true,
	},
	email: {
		type: String,
		required: true,
		unique: true,
	},
	password: {
		type: String,
		required: true,
	},
	phone: {
		type: Number,
		required: true,
		unique: true
	},
	verified: Boolean,
	createdAt:{
		type: Date,
		default: new Date
	}
});
const Reg = mongoose.model("Users", RegSchema);
module.exports = Reg;
