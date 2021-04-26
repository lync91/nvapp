const fs = require('fs');
require("dotenv").config();
const mongoose = require("mongoose");

fs.readdirSync(__dirname + '/models').forEach(function (filename) {
  if (~filename.indexOf('.js')) require(__dirname + '/models/' + filename);
});

module.exports = {
  db: async () => {
    try {
      const connection = await mongoose.connect(process.env.DATABASE, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        useCreateIndex: true,
        useFindAndModify: false,
      });
      console.log("Database connection successfull");
    } catch (error) {
      console.log("Database connection error", error);
    }
  },
};
