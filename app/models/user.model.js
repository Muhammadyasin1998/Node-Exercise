const moment = require("moment");
module.exports = (sequelize, Sequelize, DataTypes) => {
  const User = sequelize.define(
    "users", // Model name
    {
      // Attributes
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      name: {
        type: DataTypes.STRING,
      },
      phone_number: {
        type: DataTypes.STRING,
      },
      otp: {
        type: DataTypes.STRING,
      },
      otp_expiration_date: DataTypes.INTEGER,
      createdAt: {
        allowNull: false,
        type: DataTypes.INTEGER,
      },
      updatedAt: {
        allowNull: false,
        type: DataTypes.INTEGER,
      },

    },
  );

  User.beforeCreate(async (user) => {
    const currentTime = moment().unix();
    user.dataValues.createdAt = currentTime;
    user.dataValues.updatedAt = currentTime;
  });
  ``;

  User.beforeUpdate(async (user) => {
    user.dataValues.updatedAt = moment().unix();
  });

  return User;
};
