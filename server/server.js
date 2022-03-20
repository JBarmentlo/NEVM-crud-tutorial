const express 		= require("express");
const bodyParser 	= require("body-parser");
const cors 			  = require("cors");
const db 			    = require("./app/models");
const db2 			  = require("./app/newmodels");


const app = express();
var corsOptions = {
  origin: "http://localhost:8081"
};

app.use(cors(corsOptions));
// parse requests of content-type - application/json
app.use(bodyParser.json());
// parse requests of content-type - application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: true }));


require("./app/routes/user.routes")(app)
require("./app/routes/auth.js")(app)

// set port, listen for requests
const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}.`);
});