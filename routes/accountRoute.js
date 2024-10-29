// Needed Resources 
const express = require("express")
const router = new express.Router() 
const accountController = require("../controllers/accountController")
const utilities = require("../utilities")
const accountValidate = require("../utilities/account-validation")

// Route to build inventory by classification view
router.get(
  "/",
  utilities.checkLogin,
  utilities.handleErrors(accountController.buildAccountManagment)
)
router.get("/login", utilities.handleErrors(accountController.buildLogin));
router.get("/register", utilities.handleErrors(accountController.buildRegister));
router.post(
    "/register",
    accountValidate.registationRules(),
    accountValidate.checkRegData,
    utilities.handleErrors(accountController.registerAccount)
)
// Process the login attempt
router.post(
    "/login",
    accountValidate.loginRules(),
    accountValidate.checkLoginData,
    utilities.handleErrors(accountController.accountLogin)
)
// Process of logging out
router.get("/logout", utilities.handleErrors(accountController.logoutAccount))
// updateing accountinfo
router.get("/update/:account_id", utilities.handleErrors(accountController.buildAccountUpdate))
// update firstname, lastname and email
router.post(
  "/update-info", 
  accountValidate.updateRules(),
  accountValidate.checkUpdateData,
  utilities.handleErrors(accountController.updateAccountInfo))
// update password
router.post(
  "/update-password", 
  accountValidate.updatePasswordRules(),
  accountValidate.checkUpdatePasswordData,
  utilities.handleErrors(accountController.updatePassword))

module.exports = router;