// const mongoose = require("mongoose");

// const scheduleElectionColl=mongoose.Schema(
//     {
//         state:{
//             type: String
//         },
//         assemblyForElection:{
//             type: String 
//         },
//         candidates: []
//     }
// );


// module.exports= mongoose.model('scheduleElectionColl',scheduleElectionColl)


const mongoose = require("mongoose");

const scheduleElectionSchema = new mongoose.Schema({
  state: {
    type: String,
    required: true // Ensure state is provided
  },
  assemblyForElection: {
    type: String,
    required: true // Ensure assembly name is provided
  },
  candidates: [
    {
      name: {
        type: String,
        required: true // Ensure candidate name is provided
      },
      party: {
        type: String,
        required: true // Ensure party name is provided
      },
      symbol: {
        type: String,
        required: true // Ensure symbol path is provided
      }
    },
  ],
});

// Export the model
module.exports = mongoose.model("ScheduleElection", scheduleElectionSchema);
