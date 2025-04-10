const db = require("../config/db");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

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
    const token = jwt.sign({ ngo_id: ngo.ngo_id, email: ngo.email }, "your_jwt_secret", {
      expiresIn: "1h",
    });

    res.status(200).json({ message: "Login successful", token });
  } catch (error) {
    console.error("Error logging in NGO:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};