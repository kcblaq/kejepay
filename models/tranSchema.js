const mongoose = require('mongoose');

const TransactionSchema = mongoose.Schema({
    status:{
        type: String,
        emun: ["PENDING", "CONFLICT RESOLUTION", "CLOSED"],
        default: "PENDING"
    },
    initiator: {
        type: String,
        required: true
    }, 
    party: {
        type: String,
        required: true,

    },
    description:{
        type: String,
        required: true
    },
    amount: {
        type: String,
        required: true
    },
    category:{
        type: String,
        enum: ['SERVICE', 'PRODUCT', 'CONTRACT'],
        default: 'PRODUCT'
    },
    createdAt:{
        type: Date,
        default: Date.now
    },
    terms:{
        type: String,
        required: true
    },
    duration:{
        months:{ type:Number, default: 0},
        weeks:{ type:Number, default: 0},
        days: {type:Number, required: true},
        hours: Number,
        
    }
})

module.exports = mongoose.model("Transsactions", TransactionSchema)