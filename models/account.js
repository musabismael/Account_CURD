const { DataTypes } = require("sequelize");
const bcrypt = require("bcrypt");
const { sequelize } = require("../database");

const Account = sequelize.define("Account", {
  first_name: {
    type: DataTypes.STRING,
    size: 100,
    allowNull: false,
  },
  last_name: {
    type: DataTypes.STRING,
    allowNull: false,
    size: 100,
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
    size: 100,

    validate: {
      isEmail: true,
    },
  },
  phone: {
    type: DataTypes.STRING,
    allowNull: false,
    size: 16,
    validate: {
      isNumeric: true,
    },
  },
  password: {
    type: DataTypes.STRING,
    size: 50,
    allowNull: false,
  },
  birthday: {
    type: DataTypes.DATEONLY,
    allowNull: false,
    validate: {
      isDate: true,
      isFormattedDate(value) {
        if (!/^(\d{4})-(\d{2})-(\d{2})$/.test(value)) {
          throw new Error('Birthday must be in the format "yyyy-mm-dd"');
        }
      },
    },
  },
  created_at: {
    type: DataTypes.DATE,
    Format: "yyyy-mm-dd hh:mm:ss",
    allowNull: false,
    defaultValue: DataTypes.NOW,
    get() {
      return this.getDataValue("created_at")
        .toISOString()
        .replace(/T/, " ")
        .replace(/\..+/, "");
    },
  },
  last_modified: {
    type: DataTypes.DATE,
    Format: "yyyy-mm-dd hh:mm:ss",
    allowNull: false,
    defaultValue: DataTypes.NOW,
    get() {
      return this.getDataValue('created_at').toISOString().replace(/T/, ' ').replace(/\..+/, '');
    },
  },
});
Account.sync()
  .then(() => {
    console.log('Accounts table created successfully.');
  })
  .catch((error) => {
    console.error('Error creating Accounts table:', error);
  });
// Hash the password before saving
Account.beforeCreate(async (account) => {
  const hashedPassword = await bcrypt.hash(account.password, 10);
  account.password = hashedPassword;
});

module.exports = Account;
