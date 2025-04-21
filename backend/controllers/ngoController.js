const db = require("../config/db");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const crypto = require("crypto");
const nodemailer = require("nodemailer");

// NGO Registration
exports.registerNgo = async (req, res) => {
  const { name, email, password, contact_person, contact_number, address } = req.body;

  if (!name || !email || !password || !contact_person || !contact_number || !address) {
    return res.status(400).json({ message: "All fields are required" });
  }

  try {
    // Check if the NGO already exists
    const existingNgo = await new Promise((resolve, reject) => {
      db.query("SELECT * FROM ngos WHERE email = ?", [email], (err, result) =>
        err ? reject(err) : resolve(result.length > 0)
      );
    });

    if (existingNgo) {
      return res.status(400).json({ message: "NGO already registered" });
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Insert the NGO into the database
    const sql = `
      INSERT INTO ngos (name, email, password, contact_person, contact_number, address)
      VALUES (?, ?, ?, ?, ?, ?)
    `;
    const values = [name, email, hashedPassword, contact_person, contact_number, address];

    db.query(sql, values, (err, result) => {
      if (err) {
        console.error("Error registering NGO:", err);
        return res.status(500).json({ message: "Error registering NGO" });
      }

      res.status(201).json({ message: "NGO registered successfully" });
    });
  } catch (error) {
    console.error("Error registering NGO:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};
// NGO Login
exports.loginNgo = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: "Email and password are required" });
  }

  try {
    // Check if the NGO exists
    const ngo = await new Promise((resolve, reject) => {
      db.query("SELECT * FROM ngos WHERE email = ?", [email], (err, result) =>
        err ? reject(err) : resolve(result[0])
      );
    });

    if (!ngo) {
      return res.status(404).json({ message: "NGO not found" });
    }

    // Compare the password
    const isPasswordValid = await bcrypt.compare(password, ngo.password);
    if (!isPasswordValid) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    // Generate a JWT token
    const token = jwt.sign({ ngo_id: ngo.ngo_id, email: ngo.email }, process.env.JWT_SECRET, {
      expiresIn: "1h",
    });

    // Return the token and ngo_id
    res.status(200).json({
      message: "Login successful",
      token,
      ngoId: ngo.ngo_id, // Include ngo_id in the response
    });
  } catch (error) {
    console.error("Error logging in NGO:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};
// Nodemailer setup for email functionality
const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });
  
  // Forgot Password
  exports.forgotPassword = async (req, res) => {
    const { email } = req.body;
  
    if (!email) {
      return res.status(400).json({ message: "Email is required" });
    }
  
    try {
      // Check if the NGO exists
      const ngo = await new Promise((resolve, reject) => {
        db.query("SELECT * FROM ngos WHERE email = ?", [email], (err, result) =>
          err ? reject(err) : resolve(result[0])
        );
      });
  
      if (!ngo) {
        return res.status(404).json({ message: "NGO not found" });
      }
  
      // Generate a reset token
      const resetToken = crypto.randomBytes(32).toString("hex");
      const resetTokenExpiry = Date.now() + 3600000; // 1 hour
  
      // Update the NGO record with the reset token and expiry
      db.query(
        "UPDATE ngos SET reset_token = ?, reset_token_expiry = ? WHERE email = ?",
        [resetToken, resetTokenExpiry, email],
        (err) => {
          if (err) {
            console.error("Database error:", err);
            return res.status(500).json({ message: "Database error", error: err });
          }
  
          // Send the reset email
          const resetUrl = `http://localhost:3000/reset-password/${resetToken}`;
          const mailOptions = {
            from: process.env.EMAIL_USER,
            to: email,
            subject: "NGO Password Reset",
            html: `<p>You requested a password reset. Click <a href="${resetUrl}">here</a> to reset your password. This link is valid for 1 hour.</p>`,
          };
  
          transporter.sendMail(mailOptions, (error, info) => {
            if (error) {
              console.error("Error sending email:", error);
              return res.status(500).json({ message: "Error sending email", error });
            }
            console.log("Email sent:", info.response);
            res.json({ message: "Password reset email sent" });
          });
        }
      );
    } catch (error) {
      console.error("Error in forgot password:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  };
  
  // Reset Password
  exports.resetPassword = async (req, res) => {
    const { token } = req.params;
    const { password } = req.body;
  
    if (!password) {
      return res.status(400).json({ message: "Password is required" });
    }
  
    try {
      // Check if the token is valid and not expired
      const ngo = await new Promise((resolve, reject) => {
        db.query(
          "SELECT * FROM ngos WHERE reset_token = ? AND reset_token_expiry > ?",
          [token, Date.now()],
          (err, result) => {
            if (err) {
              console.error("Database error:", err);
              reject(err);
            } else {
              console.log("Token Query Result:", result); // Debugging log
              resolve(result[0]);
            }
          }
        );
      });
  
      if (!ngo) {
        return res.status(400).json({ message: "Invalid or expired token" });
      }
  
      // Hash the new password
      const hashedPassword = await bcrypt.hash(password, 10);
  
      // Update the NGO's password and clear the reset token
      db.query(
        "UPDATE ngos SET password = ?, reset_token = NULL, reset_token_expiry = NULL WHERE ngo_id = ?",
        [hashedPassword, ngo.ngo_id],
        (err) => {
          if (err) {
            console.error("Database error:", err);
            return res.status(500).json({ message: "Database error", error: err });
          }
          res.json({ message: "Password reset successful" });
        }
      );
    } catch (error) {
      console.error("Error in reset password:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  };