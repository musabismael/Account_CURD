const { DataTypes } = require("sequelize");
const bcrypt = require("bcrypt");
const { sequelize } = require("../database");

const Account = sequelize.define("Account", {
  first_name: {
    type: DataTypes.STRING(100),
    allowNull: false,
    comment: 'User first name',

  },
  last_name: {
    type: DataTypes.STRING(100),
    allowNull: false,
    comment: 'User last name',

  },
  email: {
    type: DataTypes.STRING(100),
    allowNull: false,
    unique: true,
    comment: 'User account email',

    validate: {
      isEmail: true,
    },
  },
  phone: {
    type: DataTypes.STRING(16),
    allowNull: false,
    comment: 'User phone number',

    validate: {
      isNumeric: true,
    },
  },
  password: {
    type: DataTypes.STRING(50),
    comment: 'Account password',

    allowNull: false,
  },
  birthday: {
    type: DataTypes.DATEONLY,
    allowNull: false,
    comment: 'User birth date',

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
    allowNull: false,
    comment: 'Account creation date',

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
    comment: 'Last account update date',

    allowNull: false,
    defaultValue: DataTypes.NOW,
    get() {
      return this.getDataValue("created_at")
        .toISOString()
        .replace(/T/, " ")
        .replace(/\..+/, "");
    },
  },
});
Account.sync()
  .then(() => {
    console.log("Accounts table created successfully.");
  })
  .catch((error) => {
    console.error("Error creating Accounts table:", error);
  });
// Hash the password before saving
Account.beforeCreate(async (account) => {
  const hashedPassword = await bcrypt.hash(account.password, 10);
  account.password = hashedPassword;
});

module.exports = Account;
