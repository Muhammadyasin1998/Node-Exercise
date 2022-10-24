require('dotenv').config();
const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const config = require("./app/config/config.js");
const app = express();

// A middleware that allows cross-origin requests. 
app.use(cors());

// parse requests of content-type - application/json
app.use(bodyParser.json());

// parse requests of content-type - application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: true }));

// database
const db = require("./app/models");

db.sequelize.sync({ alter: true }).then(() => {
  // Just use it in development, at the first time execution!. Delete it in production
}).catch(err => {
  console.log(`error:${err} `)
});

// api routes
require("./app/routes/user.routes")(app);

app.use(function (req, res) {
  res.status(404)
    .send({
      success: false,
      error: "Route not found",
      body: null,
    });
});

// set port, listen for requests
const PORT = config.PORT;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

