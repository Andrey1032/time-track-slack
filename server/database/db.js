const { Sequelize } = require("sequelize");
require('dotenv').config();


module.exports = new Sequelize(
  process.env.DB_CONNECTION,
  {
    dialectOptions: {
      ssl: {
        require: true,
        //   ca: rootCert, // Use the root certificate
      },
    },
    define: {
      // underscored: true, // использовать snake_case вместо camelCase для полей таблиц БД
      timestamps: false, // не добавлять поля created_at и updated_at при создании таблиц
    },
  }
);
