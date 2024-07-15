const mongoose = require("mongoose");

const votescoll=mongoose.Schema(
    {
        voterId: {
            type: String,
            required: true
        },
        state: {
            type: String,
            required: true
        },
        assemblyForElection: {
            type: String,
            required: true
        },
        selectedCandidate: {
            type: String,
            required: true
        }
    },
    { timestamps: true }
);


module.exports= mongoose.model('votescoll',votescoll)

