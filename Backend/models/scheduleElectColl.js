const mongoose = require("mongoose");

const scheduleElectionColl=mongoose.Schema(
    {
        state:{
            type: String
        },
        assemblyForElection:{
            type: String
        },
        candidates: []
    }
);


module.exports= mongoose.model('scheduleElectionColl',scheduleElectionColl)

