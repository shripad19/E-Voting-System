const mongoose = require("mongoose");

const addvotercoll=mongoose.Schema(
    {
        voterId:{
            type: String
        },
        name:{
            type: String
        },
        gender:{
            type: String
        },
        state:{
            type: String
        },
        assembly:{
            type: String
        },
        email:{
            type: String
        },
        otp: {
            type: String, // OTP will be stored as a string
            required: false, // OTP is optional
        },
        hasVoted: { 
            type: Boolean, 
            default: false 
        }
    }
);


module.exports= mongoose.model('addvotercoll',addvotercoll)

