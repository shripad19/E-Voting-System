const mongoose = require("mongoose");

const addadminscoll=mongoose.Schema(
    {
        adminId:{
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
        }
    }
);


module.exports= mongoose.model('addadminscoll',addadminscoll)

