const express = require("express");
const multer = require("multer");
const mongoose = require("mongoose");
const ScheduleElection = require("./models/scheduleElectColl");
const AddVoter = require("./models/addVoter"); // AddVoter is called as mongoose model
const AddAdmins = require("./models/addAdmin");
const Votes = require("./models/votes");
const cors = require("cors");
const bodyParser = require("body-parser");
const nodemailer = require("nodemailer");
const crypto = require("crypto");
require("dotenv").config(); // Require dotenv to load environment variables


const app = express();
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors());
const port = 5000;

const fs = require("fs");
const path = require("path");

// Database connection
mongoose
    .connect(process.env.DATABASE_URL)
    .then(() => {
        console.log("Connected to database");
    })
    .catch((err) => {
        console.error("Error connecting to database:", err.message);
    });


const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, "uploads/"); // Specify upload directory
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + path.extname(file.originalname)); // Unique file names
    },
});

const upload = multer({ storage }).array("symbols"); // Adjust field name to match frontend

app.use('/uploads', express.static(path.join(__dirname, 'uploads')));


// Encryption configuration
const ENCRYPTION_KEY = process.env.ENCRYPTION_KEY;
if (!ENCRYPTION_KEY) {
    throw new Error("ENCRYPTION_KEY is not set in .env file");
}

const IV_LENGTH = 16; // Initialization vector length
console.log(ENCRYPTION_KEY.length); // Should print 64 for 32-byte key in hexadecimal (32 * 2 = 64)
console.log("Encryption Key: ", ENCRYPTION_KEY);

if (!ENCRYPTION_KEY) {
    throw new Error("ENCRYPTION_KEY is not set in .env file");
}

// Encrypt function
const encrypt = (text, encryptionKey) => {
    const iv = crypto.randomBytes(16); // Generate a 16-byte IV
    const cipher = crypto.createCipheriv('aes-256-cbc', Buffer.from(encryptionKey, 'hex'), iv);

    let encrypted = cipher.update(text, 'utf8', 'hex');
    encrypted += cipher.final('hex');

    return `${iv.toString('hex')}:${encrypted}`; // Return IV and encrypted text
};

const decrypt = (encryptedText, encryptionKey) => {
    try {
        const [ivHex, encryptedHex] = encryptedText.split(':'); // Split into IV and encrypted text
        if (!ivHex || !encryptedHex) {
            throw new Error("Invalid encrypted text format");
        }

        const iv = Buffer.from(ivHex, 'hex');
        const encrypted = Buffer.from(encryptedHex, 'hex');
        const decipher = crypto.createDecipheriv('aes-256-cbc', Buffer.from(encryptionKey, 'hex'), iv);

        let decrypted = decipher.update(encrypted, 'hex', 'utf8');
        decrypted += decipher.final('utf8');
        console.log(decrypted);

        return decrypted;
    } catch (err) {
        console.error("Decryption error:", err.message);
        throw err;
    }
};

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
        const admins = await AddAdmins.find();

        const admin = admins.find(admin => {
            try {
                return admin.adminId && decrypt(admin.adminId, ENCRYPTION_KEY) === adminId; // Safely decrypt adminId
            } catch (error) {
                console.error("Decryption failed for adminId:", error.message);
                return false; // Skip this admin if decryption fails
            }
        });


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
                to: decrypt(admin.email, ENCRYPTION_KEY), // Assuming email is stored in the database
                subject: "Verification OTP for E-Voting",
                text: `Your OTP for verification is ${otp}. Please use it to complete your verification process.`,
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
        const admins = await AddAdmins.find();

        const admin = admins.find(admin => {
            try {
                return admin.adminId && decrypt(admin.adminId, ENCRYPTION_KEY) === adminId; // Safely decrypt adminId
            } catch (error) {
                console.error("Decryption failed for adminId:", error.message);
                return false; // Skip this admin if decryption fails
            }
        });


        if (!admin) {
            return res.status(404).json({
                status: "error",
                message: "Admin not found or adminId mismatch",
            });
        }

        console.log("Admin's OTP from DB:", admin.otp);
        
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
        const voters = await AddVoter.find();

        const voter = voters.find(voter => {
            try {
                return voter.voterId && decrypt(voter.voterId, ENCRYPTION_KEY) === voterId; // Safely decrypt voterId
            } catch (error) {
                console.error("Decryption failed for voterId:", error.message);
                return false; // Skip this voter if decryption fails
            }
        });

        if (voter) {
            if (voter.hasVoted) {
                return res.json({ status: "already", message: "You have already voted." });
            }

            const otp = generateOTP();
            console.log("OTP is: ", otp);
            voter.otp = otp; // Save OTP as plain text
            await voter.save();

            const mailOptions = {
                from: process.env.EMAIL_USER,
                to: decrypt(voter.email, ENCRYPTION_KEY), // Decrypt email to send OTP
                subject: "Verification OTP for e-Voting",
                text: `Your OTP for verification is ${otp}. Please use it to complete your verification process.`,
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
        const voters = await AddVoter.find();

        const voter = voters.find(voter => {
            try {
                return voter.voterId && decrypt(voter.voterId, ENCRYPTION_KEY) === voterId; // Safely decrypt voterId
            } catch (error) {
                console.error("Decryption failed for voterId:", error.message);
                return false; // Skip this voter if decryption fails
            }
        });

        if (!voter) {
            return res.status(404).json({
                status: "error",
                message: "Voter not found or voterId mismatch",
            });
        }

        console.log("Voter's OTP from DB:", voter.otp);

        if (voter.otp === otp) {
            voter.otp = ""; // Clear OTP after successful verification
            await voter.save();
            res.json({ status: "registered" });
        } else {
            res.json({ status: "otp_invalid", message: "OTP is invalid" });
        }
    } catch (error) {
        console.error("Error verifying OTP:", error);
        res.status(500).json({
            status: "error",
            message: "An error occurred while verifying OTP",
        });
    }
});


// Helper function to generate OTP
function generateOTP() {
    return crypto.randomBytes(3).toString("hex"); // Adjust length as needed
}


//Add Voter
app.post("/add-voter", async (req, res) => {
    console.log("Add voter request arrived");

    const { voterId, name, gender, state, assembly, email } = req.body;

    if (!voterId || !email || !state || !assembly) {
        return res.status(400).json({
            status: "error",
            message: "Missing required fields: voterId, email, state, or assembly",
        });
    }

    try {
        const voterData = {
            voterId: encrypt(voterId, ENCRYPTION_KEY), // Encrypt voterId
            email: encrypt(email, ENCRYPTION_KEY),    // Encrypt email
            name,
            gender,
            state,
            assembly,
            hasVoted: false,
        };

        const newVoter = new AddVoter(voterData); // Create an instance of AddVoter
        const result = await newVoter.save();
        res.json({ status: "ok", data: result });
    } catch (error) {
        console.error("Error adding voter:", error);
        res.status(500).json({ status: "error", message: "Failed to add voter" });
    }
});


app.post("/add-admins", async (req, res) => {
    console.log("Add admin request arrived");

    const { adminId, name, gender, state, assembly, email } = req.body;

    if (!adminId || !email || !state || !assembly) {
        return res.status(400).json({
            status: "error",
            message: "Missing required fields: voterId, email, state, or assembly",
        });
    }

    try {
        const adminData = {
            adminId: encrypt(adminId, ENCRYPTION_KEY), // Encrypt voterId
            email: encrypt(email, ENCRYPTION_KEY),    // Encrypt email
            name,
            gender,
            state,
            assembly,
        };

        const newAdmin = new AddAdmins(adminData);
        const result = await newAdmin.save();
        res.json({ status: "ok", data: result });
    } catch (error) {
        console.error("Error adding admin:", error);
        res.status(500).json({ status: 'error', message: 'Failed to add voter' });
    }
});


//Schedule Election
app.post("/schedule-election", upload, async (req, res) => {
    try {
        const { state, assemblyForElection, candidatesData } = req.body;

        // Remove existing election if it exists
        await ScheduleElection.findOneAndDelete({ state, assemblyForElection });

        // Remove existing votes if they exist
        await Votes.deleteMany({ state, assemblyForElection });

        // Set hasVoted to false for all voters in the specified state and assembly
        await AddVoter.updateMany({ state, assembly: assemblyForElection }, { hasVoted: false });

        // Parse candidates data
        let candidates = [];
        try {
            candidates = JSON.parse(candidatesData);
        } catch (err) {
            return res.status(400).json({ status: "error", message: "Invalid candidates data format." });
        }

        // Add the symbol paths to candidates
        if (req.files) {
            req.files.forEach((file, index) => {
                if (candidates[index]) {
                    candidates[index].symbol = file.path;
                }
            });
        }

        // Save the election
        const election = new ScheduleElection({ state, assemblyForElection, candidates });
        await election.save();

        res.json({ status: "ok", message: "Election scheduled successfully!" });
    } catch (error) {
        console.error("Error scheduling election:", error.stack);
        res.status(500).json({ status: "error", message: "Failed to schedule election." });
    }
});


app.post("/cast-vote", async (req, res) => {
    console.log("Cast vote request arrived");
    try {
        // Validate request body
        const { voterId, state, assemblyForElection, selectedCandidate } = req.body;
        if (!voterId || !state || !assemblyForElection || !selectedCandidate) {
            return res.status(400).json({
                status: "error",
                message: "Missing required fields: voterID, state, assemblyForElection, or selectedCandidate"
            });
        }

        const voters = await AddVoter.find();

        const voter = voters.find(voter => {
            try {
                return voter.voterId && decrypt(voter.voterId, ENCRYPTION_KEY) === voterId; // Safely decrypt voterId
            } catch (error) {
                console.error("Decryption failed for voterId:", error.message);
                return false; // Skip this voter if decryption fails
            }
        });
        voter.hasVoted = true;
        await voter.save();

        // Encrypt candidate selection
        const encryptedCandidate = encrypt(selectedCandidate, ENCRYPTION_KEY);//since if anyone got unauthorised access to database & if he will increase count of his leader. so idenetity of candidate should be encrypted in database

        // Prepare vote data
        const voteData = {
            voterId,
            state,
            assemblyForElection,
            selectedCandidate: encryptedCandidate, // Store encrypted candidate
        };

        // Save vote to the database
        const newVote = new Votes(voteData);
        const result = await newVote.save();

        console.log("Vote successfully cast:", result);
        res.json({ status: "ok", data: result });
    } catch (error) {
        console.error("Error casting vote:", error.message);
        res.status(500).json({ status: "error", message: "Failed to cast vote" });
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
    console.log(voterId);
    try {
        const voters = await AddVoter.find();

        const voter = voters.find(voter => {
            try {
                return voter.voterId && decrypt(voter.voterId, ENCRYPTION_KEY) === voterId; // Safely decrypt voterId
            } catch (error) {
                console.error("Decryption failed for voterId:", error.message);
                return false; // Skip this voter if decryption fails
            }
        });

        if (!voter) {
            res.json({ status: 'error', message: 'Voter not found' });
            return;
        }
        // Return voter details
        const { state, assembly } = voter;
        console.log(state);
        console.log(assembly);
        res.json({ status: 'ok', state, assembly });
    } catch (error) {
        console.error('Error fetching voter details:', error);
        res.status(500).json({ status: 'error', message: 'An error occurred while fetching voter details' });
    }
});


app.post("/view-results", async (req, res) => {
    const { state, assemblyForElection } = req.body;

    try {
        // Fetch the election data for the given state and assembly
        const election = await ScheduleElection.findOne({ state, assemblyForElection });
        if (!election) {
            return res.status(404).json({ status: "error", message: "Election not found" });
        }

        // Initialize a results object to store vote counts
        const results = {};

        // Decrypt and count votes
        const votes = await Votes.find({ state, assemblyForElection });
        votes.forEach((vote) => {
            const candidateName = decrypt(vote.selectedCandidate, ENCRYPTION_KEY);
            if (results[candidateName]) {
                results[candidateName].count += 1; // Increment vote count
            } else {
                results[candidateName] = { count: 1, symbol: null }; // Initialize count
            }
        });

        // Map candidates and their symbols from the election data
        election.candidates.forEach((candidate) => {
            if (results[candidate.name]) {
                results[candidate.name].symbol = candidate.symbol; // Attach the symbol
            } else {
                results[candidate.name] = { count: 0, symbol: candidate.symbol }; // Include candidates with zero votes
            }
        });

        // Convert results to an array for frontend compatibility
        const formattedResults = Object.keys(results).map((candidateName) => ({
            candidate: candidateName,
            votes: results[candidateName].count,
            symbol: results[candidateName].symbol,
        }));

        // Determine the maximum votes and identify all candidates with that vote count
        const maxVotes = Math.max(...formattedResults.map(candidate => candidate.votes));

        // Find all candidates with the maximum votes
        const winners = formattedResults.filter(candidate => candidate.votes === maxVotes);

        res.json({
            status: "ok",
            results: formattedResults,
            winners: winners.map(winner => winner.candidate), // Pass an array of winners to the frontend
        });

    } catch (error) {
        console.error("Error viewing results:", error.message);
        res.status(500).json({ status: "error", message: "An error occurred while fetching election results" });
    }
});

app.listen(port, () => {
    console.log(`Server running on ${port}`);
});
