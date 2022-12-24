const mongoose = require('mongoose');

const OtpSchema = new mongoose.Schema({
    userId: {
        type: String,
        required: true
    },
    otp: Number,
    createdAt: {
        type: Date,
        default: new Date(),
        required: false
    },
    expiresAt: {
        type: Date,
        required: false
    }

})

module.exports = mongoose.model('otp', OtpSchema)