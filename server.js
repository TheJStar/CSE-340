/* ******************************************
 * This server.js file is the primary file of the 
 * application. It is used to control the project.
 *******************************************/
/* ***********************
 * Require Statements
 *************************/
const baseController = require("./controllers/baseController")
const inventoryRoute = require("./routes/inventoryRoute")
const accountRoute = require("./routes/accountRoute")
const errorController = require("./controllers/errorController")
const express = require("express")
const expressLayouts = require("express-ejs-layouts")
const env = require("dotenv").config()
const app = express()
const static = require("./routes/static")
const utilities = require("./utilities/")
const session = require("express-session")
const pool = require('./database/')
const bodyParser = require("body-parser")
const cookieParser = require("cookie-parser")

/* ***********************
 * Middleware
 * ************************/
app.use(session({
  store: new (require('connect-pg-simple')(session))({
    createTableIfMissing: true,
    pool,
  }),
  secret: process.env.SESSION_SECRET,
  resave: true,
  saveUninitialized: true,
  name: 'sessionId',
}))

// Express Messages Middleware
app.use(require('connect-flash')())
app.use(function(req, res, next){
  res.locals.messages = require('express-messages')(req, res)
  next()
})

// body parser
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true })) // for parsing application/x-www-form-urlencoded
// Login
app.use(cookieParser())
//login process checks the cookie for token
app.use(utilities.checkJWTToken)

/* ***********************
 * Veiw Engien and Templates
 *************************/
app.set("view engine", "ejs")
app.use(expressLayouts)
app.set("layout", "./layouts/layout") // not at views root

/* ***********************
 * Routes
 *************************/
app.use(static)

// index route
app.get("/", utilities.handleErrors(baseController.buildHome))

// test route
app.use("/test", 
  (req, res) => {
    console.log("contact")
    console.log(req.cookies)
    res.clearCookie("jwt")
    console.log(req.cookies)
    return res.sendStatus(200)
  },
  async (req, res) => {
    let nav = await utilities.getNav()
    let account = await utilities.getLoginCheck(req, res)
    res.render("index", {
        accountData: account,
        title: "bread",
        nav
        })
      }  
)

// Inventory routes
app.use("/inv", utilities.handleErrors(inventoryRoute))

// Account routes
app.use("/account", utilities.handleErrors(accountRoute))

// Error maker route
app.use('/inv', utilities.handleErrors(errorController.makeError))

// File Not Found Route - must be last route in list
app.use(async (req, res, next) => {
  next({status: 404, message: '<b>Sorry!</b> we appear to have lost that page.', bean: '🫘'})
})

// everything has to be above this line for it to work becasue there is an error handler bellow

/* ***********************
* Express Error Handler
* Place after all other middleware
*************************/
app.use(async (err, req, res, next) => {
  let nav = await utilities.getNav()
  let accountData = await utilities.getLoginCheck(req, res)
  console.error(`Error at: "${req.originalUrl}": ${err.message}`)
  if (err.status == 404) {
    message = err.message
  } else {
    message = 'Oh no! There was a crash. Maybe try a different route?'
  }
  res.render("errors/error", {
    title: err.status || 'Server Error',
    message: message,
    bean: err.bean,
    nav, accountData
  })
})

/* ***********************
 * Local Server Information
 * Values from .env (environment) file
 *************************/
const port = process.env.PORT || 4000
const host = process.env.HOST

/* ***********************
 * Log statement to confirm server operation
 *************************/
app.listen(port, () => {
  console.log(`app listening on ${host}:${port}`)
})
