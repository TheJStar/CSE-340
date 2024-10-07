/* ******************************************
 * This server.js file is the primary file of the 
 * application. It is used to control the project.
 *******************************************/
/* ***********************
 * Require Statements
 *************************/
const baseController = require("./controllers/baseController")
const inventoryRoute = require("./routes/inventoryRoute")
const carViewRoute = require("./routes/carViewRoute")
const errorController = require("./controllers/errorController")
const express = require("express")
const expressLayouts = require("express-ejs-layouts")
const env = require("dotenv").config()
const app = express()
const static = require("./routes/static")
const utilities = require("./utilities/")


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

// Inventory routes
app.use("/inv", utilities.handleErrors(inventoryRoute))

// Car view route
app.use('/inv', utilities.handleErrors(carViewRoute))

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
    nav
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
