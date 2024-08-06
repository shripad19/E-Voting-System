const express = require("express");
const mongoose = require("mongoose");
const ScheduleElection = require("./models/scheduleElectColl");
const AddVoter = require("./models/addVoter"); //AddVoter is called as mongoose model
const AddAdmins = require("./models/addAdmin");
const Votes = require("./models/votes");
const cors = require('cors');
const bodyParser = require("body-parser");
const nodemailer = require("nodemailer");
const crypto = require("crypto");
require('dotenv').config(); // Require dotenv to load environment variables

const app = express();
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors());
const port = 5000;

mongoose.connect(process.env.DATABASE_URL, {
}).then(() => {
    console.log("Connected to database");
}).catch((err) => {
    console.error("Error connecting to database:", err.message);
});

// Nodemailer transporter setup
const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 587,
    secure: false,
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
    },
    authMethod: 'PLAIN',
    debug: true, // Enable debug output
});

app.get("/", (req, res) => {
    res.send("This is the server");
});

// Endpoint to check admin registration
app.post("/check-admin", async (req, res) => {
    const { adminId } = req.body;
    try {
        const admin = await AddAdmins.findOne({ adminId });
        if (admin) {
            const otp = generateOTP();
            console.log("Otp is : ");
            console.log(otp);
            // Save OTP to database or temporary storage
            admin.otp = otp;
            await admin.save();

            // Send OTP to voter's email
            const mailOptions = {
                from: process.env.EMAIL_USER,
                to: admin.email, // Assuming email is stored in the database
                subject: "Verification OTP for E-Voting",
                text: `Your OTP for verification is ${otp}. It is valid for 10 minutes.`,
            };

            transporter.sendMail(mailOptions, (error, info) => {
                if (error) {
                    console.error("Error sending email:", error);
                    res.status(500).json({ status: "error", message: "Failed to send OTP email" });
                } else {
                    console.log("Email sent: " + info.response);
                    res.json({ status: "otp_sent" });
                }
            });
        } else {
            res.json({ status: "not_registered" });
        }
    } catch (error) {
        console.error("Error checking admin:", error);
        res.status(500).json({ status: "error", message: "An error occurred while checking the Admin ID" });
    }
});

// Endpoint to verify OTP
app.post("/verify-admin-otp", async (req, res) => {
    const { adminId, otp } = req.body;
    try {
        const admin = await AddAdmins.findOne({ adminId });
        console.log("Admin otp : ");
        console.log(admin.otp);
        if (admin && admin.otp === otp) {
            // Clear OTP after successful verification
            admin.otp = "";
            await admin.save();
            res.json({ status: "registered" });
        } else {
            res.json({ status: "otp_invalid" });
        }
    } catch (error) {
        console.error("Error verifying OTP:", error);
        res.status(500).json({ status: "error", message: "An error occurred while verifying OTP" });
    }
});

// Endpoint to check voter registration
app.post("/check-voter", async (req, res) => {
    const { voterId } = req.body;
    try {
        const voter = await AddVoter.findOne({ voterId });
        if (voter) {
            // Generate OTP
            if (voter.hasVoted) {
                return res.json({ status: 'already', message: 'You have already voted.' });
              }
          
              // Proceed with the vote casting logic here...
              // Update the hasVoted field to true after successful voting
              voter.hasVoted = true;
              await voter.save();
            const otp = generateOTP();
            console.log("Otp is : ");
            console.log(otp);
            // Save OTP to database or temporary storage
            voter.otp = otp;
            await voter.save();

            // Send OTP to voter's email
            const mailOptions = {
                from: process.env.EMAIL_USER,
                to: voter.email, // Assuming email is stored in the database
                subject: "Verification OTP for e-Voting",
                text: `Your OTP for verification is ${otp}. It is valid for 10 minutes.`,
            };

            transporter.sendMail(mailOptions, (error, info) => {
                if (error) {
                    console.error("Error sending email:", error);
                    res.status(500).json({ status: "error", message: "Failed to send OTP email" });
                } else {
                    console.log("Email sent: " + info.response);
                    res.json({ status: "otp_sent" });
                }
            });
        } else {
            res.json({ status: "not_registered" });
        }
    } catch (error) {
        console.error("Error checking voter:", error);
        res.status(500).json({ status: "error", message: "An error occurred while checking the voter ID" });
    }
});

// Endpoint to verify OTP
app.post("/verify-otp", async (req, res) => {
    const { voterId, otp } = req.body;
    try {
        const voter = await AddVoter.findOne({ voterId });
        console.log("Voters otp : ");
        console.log(voter.otp);
        if (voter && voter.otp === otp) {
            // Clear OTP after successful verification
            voter.otp = "";
            await voter.save();
            res.json({ status: "registered" });
        } else {
            res.json({ status: "otp_invalid" });
        }
    } catch (error) {
        console.error("Error verifying OTP:", error);
        res.status(500).json({ status: "error", message: "An error occurred while verifying OTP" });
    }
});

// Helper function to generate OTP
function generateOTP() {
    return crypto.randomBytes(3).toString("hex"); // Adjust length as needed
}


//Add Voter
app.post("/add-voter", async (req, res) => {
    console.log("Add voter request arrived");
    try {
        const newVoter = new AddVoter(req.body); //creating instance of AddVoter mongoose model
        const result = await newVoter.save();
        res.json({ status: "ok", data: result });
    } catch (error) {
        console.error("Error adding voter:", error);
        res.status(500).json({ status: 'error', message: 'Failed to add voter' });
    }
});

//Schedule Election
app.post("/schedule-election", async (req, res) => {
    console.log("Schedule election request arrived");
    const { state, assemblyForElection, candidates } = req.body;

    try {
        // Remove existing election if it exists
        await ScheduleElection.findOneAndDelete({ state, assemblyForElection });
        
        // Remove existing votes if they exist
        await Votes.deleteMany({ state, assemblyForElection });

        // Schedule the new election
        const newSchedule = new ScheduleElection({
            state,
            assemblyForElection,
            candidates
        });
        const result = await newSchedule.save();
        // Set hasVoted to false for all voters in the specified state and assembly
        await AddVoter.updateMany({ state, assembly: assemblyForElection }, { hasVoted: false });
        res.json({ status: "ok", data: result });
    } catch (error) {
        console.error("Error scheduling election:", error);
        res.status(500).json({ status: 'error', message: 'Failed to schedule election' });
    }
});

app.post("/add-admins", async (req, res) => {
    console.log("Add admin request arrived");
    try {
        const newAdmin = new AddAdmins(req.body);
        const result = await newAdmin.save();
        res.json({ status: "ok", data: result });
    } catch (error) {
        console.error("Error adding admin:", error);
        res.status(500).json({ status: 'error', message: 'Failed to add voter' });
    }
});

app.post("/cast-vote", async (req, res) => {
    console.log("Cast vote request arrived");
    try {
        const newVote = new Votes(req.body);
        const result = await newVote.save();
        res.json({ status: "ok", data: result });
    } catch (error) {
        console.error("Error casting vote:", error);
        res.status(500).json({ status: 'error', message: 'Failed to cast vote' });
    }
});

app.post('/get-candidates', async (req, res) => {
    const { state, assemblyForElection } = req.body;
    try {
        const election = await ScheduleElection.findOne({ state, assemblyForElection });
        if (election) {
            res.json({ status: 'ok', candidates: election.candidates });
        } else {
            res.json({ status: 'error', message: 'No candidates found for this election' });
        }
    } catch (error) {
        console.error('Error fetching candidates:', error);
        res.status(500).json({ status: 'error', message: 'An error occurred while fetching candidates' });
    }
});


// Other endpoints for scheduling election, adding voter, casting vote, etc. as per your application requirements

app.post('/get-details', async (req, res) => {
    const { voterId } = req.body;
    try {
        const voter = await AddVoter.findOne({ voterId });
        if (voter) {
            const { state, assembly } = voter;
            res.json({ status: 'ok', state, assembly });
        } else {
            res.json({ status: 'error', message: 'Voter not found' });
        }
    } catch (error) {
        console.error('Error fetching voter details:', error);
        res.status(500).json({ status: 'error', message: 'An error occurred while fetching voter details' });
    }
});

// New endpoint to fetch election results based on state and assembly
app.post('/view-result', async (req, res) => {
    const { state, assemblyForElection } = req.body;
    console.log(`Received request to view results for state: ${state}, assembly: ${assemblyForElection}`);
    try {
        const votes = await Votes.find({ state, assemblyForElection });
        console.log(`Found votes: ${votes}`);
        if (votes.length === 0) {
            return res.json({ status: 'no_results', message: 'No results found for the specified state and assembly.' });
        }

        const results = {};
        votes.forEach(vote => {
            const candidateName = vote.selectedCandidate;
            if (!results[candidateName]) {
                results[candidateName] = 0;
            }
            results[candidateName] += 1; // Increment the vote count for the candidate
        });

        // Determine the winner
        const winner = Object.keys(results).reduce((a, b) => results[a] > results[b] ? a : b);

        res.json({ status: 'ok', results, winner });
    } catch (error) {
        console.error('Error fetching results:', error);
        res.status(500).json({ status: 'error', message: 'Error fetching results.' });
    }
});



app.listen(port, () => {
    console.log(`Server running on ${port}`);
});
