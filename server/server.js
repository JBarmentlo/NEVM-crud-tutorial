const express    = require("express");
const bodyParser = require("body-parser");
const cors       = require("cors");

require('dotenv').config()

const app = express();

var corsOptions = {
  origin: "localhost:8080"
};

app.use(cors());
app.use(bodyParser.json({limit: '50mb'}));
app.use(bodyParser.urlencoded({ extended: true }));


const sanitizer = require("perfect-express-sanitizer");

app.use(sanitizer.clean({
    xss: false,
    noSql: false,
    sql: true,
    sqlLevel: 4,
}, whitelist = ["/api/image/upload", "api/test"]));

// app.use((req, res, next) => {
//   console.log('Time:', Date.now())
//   console.log("inje: ",sqlinjection(req, res))
//   console.log("going next")
//   next()
// })


const userRouter = require("./src/routes/user.routes")
const authRouter = require("./src/routes/auth.routes")
const tagRouter  = require("./src/routes/tag.routes")


// app.use(sqlinjection);  // add sql-injection middleware here


// #######################   USER ROUTES   ########################

app.use('/api/users',userRouter, function(req, res, next){
  res.header(
    "Acces-Control-Allow-Headers",
    "x-access-token, Origin, Content-Type, Accept"
  );
  next();
})



// #######################   AUTH ROUTES   ########################

app.use('/api/auth', authRouter, function(req, res, next){
  res.header(
    "Access-Control-Allow-Headers",
    "x-access-token, Origin, Content-Type, Accept"
  );
  next();
}) // auth authentication



// #######################   TAG ROUTES   ########################

app.use('/api/tags', tagRouter, function(req, res, next){
  res.header(
    "Access-Control-Allow-Headers",
    "x-access-token, Origin, Content-Type, Accept"
  );
  next();
}) // auth authentication



// #######################   TEST ROUTES   ########################

testRouter = require('./src/routes/test.routes')

if (process.env.ENVIRONMENT == 'TEST') {
  console.log("Setting up test routes")
  app.use('/api/test', testRouter, function(req, res, next){
    res.header(
      "Access-Control-Allow-Headers",
      "x-access-token, Origin, Content-Type, Accept"
    );
    next();
  })
}


// #######################  NOTIF ROUTES   ########################

notifRouter = require('./src/routes/notif.routes')


app.use('/api/notif', notifRouter, function(req, res, next){
  res.header(
    "Access-Control-Allow-Headers",
    "x-access-token, Origin, Content-Type, Accept"
  );
  next();
})

console.log("ENVIO", process.env.ENVIRONMENT)
// #######################  CHAT ROUTES   ########################

chatRouter = require('./src/routes/chat.routes')


app.use('/api/chat', chatRouter, function(req, res, next){
  res.header(
    "Access-Control-Allow-Headers",
    "x-access-token, Origin, Content-Type, Accept"
  );
  next();
})


// #######################   IMAGE ROUTES   ########################



require("./src/routes/image.routes")(app)


const PORT = process.env.PORT || 80;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}.`);
});



// #######################   SERVE CLIENT DIST   ########################

app.use("/", express.static('client_dist'));
