const utilities = require("../utilities")
const accountModel = require("../models/account-model")
const accountCont = {}

accountCont.buildLogin = async function (req, res, next) {
    const nav = await utilities.getNav()
    //req.flash("notice", "message to be displayed if needed")
    res.render("account/login", {
        title: 'Login', 
        nav,
        errors: null,
    })
}

/* ****************************************
*  Deliver registration view
* *************************************** */
accountCont.buildRegister = async function(req, res, next) {
    let nav = await utilities.getNav()
    res.render("account/register", {
      title: "Register",
      nav,
      errors: null,
    })
}

/* ****************************************
*  Process Registration
* *************************************** */
accountCont.registerAccount = async function (req, res) {
    let nav = await utilities.getNav()
    const { account_firstname, account_lastname, account_email, account_password } = req.body
  
    const regResult = await accountModel.registerAccount(
      account_firstname,
      account_lastname,
      account_email,
      account_password
    )
  
    if (regResult) {
      req.flash(
        "notice",
        `Congratulations, you\'re registered ${account_firstname}. Please log in.`
      )
      res.status(201).render("account/login", {
        title: "Login",
        nav,
        errors: null,
      })
    } else {
      req.flash("notice", "Sorry, the registration failed.")
      res.status(501).render("account/register", {
        title: "Registration",
        nav,
      })
    }
}

/* ****************************************
*  Process Login
* *************************************** */
accountCont.loginAccount = async function (req, res) {
    let nav = await utilities.getNav()
    const { account_email, account_password } = req.body
  
    const logResult = await accountModel.checkExistingCredentials(
      account_email,
      account_password
    )
  
    if (logResult) {
      req.flash(
        "notice",
        `Congratulations, you\'re Loged in ${account_firstname}`
      )
      res.status(201).render("/", {
        title: "Home",
        nav,
        errors: null,
      })
    } else {
      req.flash("notice", "Sorry, your were unable to log in")
      res.status(501).render("account/login", {
        title: "Login",
        nav,
        errors: null,
      })
    }
}

module.exports = accountCont