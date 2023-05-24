const express = require("express");
const bodyParser = require("body-parser");
const jwt = require("jsonwebtoken");
const { sequelize, testDatabaseConnection } = require("./database");
const Account = require("./models/account");

const app = express();
const port = 3000; // Change the port if desired

app.use(bodyParser.json());

// Test the database connection
testDatabaseConnection();

// CRUD Endpoints for Account
// Create Account
app.post("/accounts", async (req, res) => {
  try {
    const account = await Account.create(req.body);
    console.log('done' );

    res.status(201).json(account);
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
