const express = require("express");
const bodyParser = require("body-parser");
const jwt = require("jsonwebtoken");
const { sequelize, testDatabaseConnection } = require("./database");
const Account = require("./models/account");
const nodemailer = require('nodemailer');

const app = express();
const port = 3000; // Change the port if desired

app.use(bodyParser.json());

// Test the database connection
testDatabaseConnection();


const transporter = nodemailer.createTransport({
    // Add your email service provider configuration here
    service: 'hotmail',
    auth: {
      user: 'musabdevs99@outlook.com',
      pass: 'musabdevs@1994',
    },
  });
  
// CRUD Endpoints for Account
// Create Account
app.post("/accounts", async (req, res) => {
  try {
    const account = await Account.create(req.body);

    res.status(201).json(account);

     // Send informational email
     const mailOptions = {
        from: 'musabdevs99@outlook.com',
        to: account.email,
        subject: 'Account Created',
        text: 'Your account has been successfully created.',
      };

      transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
          console.log('Error sending email:', error);
        } else {
          console.log('Email sent:', info.response);
        }
      });
  } catch (error) {
    console.log(error.message );

    res.status(400).json({ error: error.message });
  }
});

// Read Account
app.get("/accounts/:id", async (req, res) => {
  try {
    const account = await Account.findByPk(req.params.id);
    if (account) {
      res.json(account);
    } else {
      res.status(404).json({ error: "Account not found" });
    }
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Update Account
app.put("/accounts/:id", async (req, res) => {
  try {
    const account = await Account.findByPk(req.params.id);
    if (account) {
      await account.update(req.body);
      res.json(account);
    } else {
      res.status(404).json({ error: "Account not found" });
    }
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Delete Account
app.delete("/accounts/:id", async (req, res) => {
  try {
    const account = await Account.findByPk(req.params.id);
    if (account) {
      await account.destroy();
      res.sendStatus(204);
    } else {
      res.status(404).json({ error: "Account not found" });
    }
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// User Login Endpoint
app.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    const account = await Account.findOne({ where: { email } });
    if (account && (await bcrypt.compare(password, account.password))) {
      const token = jwt.sign({ id: account.id }, "secret-key"); // Replace 'secret-key' with your own secret key
      res.json({ token });
    } else {
      res.status(401).json({ error: "Invalid email or password" });
    }
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// List of Accounts Endpoint with Result Limitation
app.get("/accounts", async (req, res) => {
  try {
    const limit = req.query.limit ? parseInt(req.query.limit) : 10; // Default limit is 10
    const accounts = await Account.findAll({ limit });
    res.json(accounts);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Start the server
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
