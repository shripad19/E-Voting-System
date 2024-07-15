# **E-Voting System**

E-Voting System is a web application designed for efficient election management and voting operations. It allows administrators to manage elections seamlessly while providing voters with a user-friendly interface to cast their votes securely.

## **Features**

### **Admin Login**
- **OTP Verification:** Admins must verify their email via OTP before logging in.
- **Admin Operations:**
  - Register other admins.
  - Register voters.
  - Schedule elections by specifying state, assembly, candidates, and parties.
  - View election results by state and assembly.

### **Voter Login**
- **Voter ID Verification:** Voters must verify their voter ID via OTP, ensuring secure access.
- **Voting Interface:** 
  - View candidates for their registered state and assembly.
  - Cast votes securely.
  - Prevents duplicate voting by warning if already voted.

## **Technologies Used**

- **Frontend:** React.js
- **Backend:** Node.js, Express.js
- **Database:** MongoDB
- **Styling:** Bootstrap
- **Authentication:** OTP-based verification

## **Setup and Installation**

### **Prerequisites**
- Node.js
- MongoDB

### **Installation Steps**

1. **Clone the repository:**
   ```bash
   git clone https://github.com/shripad19/E-Voting-System.git
2.  Install server and client dependencies, set up environment variables, start MongoDB, run the server and client, and open the application in your browser by following the steps provided.
