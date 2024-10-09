// Needed Resources 
const express = require("express")
const router = new express.Router() 
const accountController = require("../controllers/accountController")
const utilities = require("../utilities")
const accountValidate = require("../utilities/account-validation")

// Route to build inventory by classification view
router.get("/login", utilities.handleErrors(accountController.buildLogin));
router.get("/register", utilities.handleErrors(accountController.buildRegister));
router.post(
    "/register",
    accountValidate.registationRules(),
    accountValidate.checkRegData,
    utilities.handleErrors(accountController.registerAccount)
)
// temporary
// Process the login attempt
router.post(
    "/login",
    accountValidate.loginRules(),
    accountValidate.checkLogData,
    (req, res) => {
      res.status(200).send('login process')
    }
  )

module.exports = router;