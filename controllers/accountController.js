const utilities = require("../utilities")
const accountModel = require("../models/account-model")
const bcrypt = require("bcryptjs")
const accountCont = {}
const jwt = require("jsonwebtoken")
const { cookie } = require("express-validator")
require("dotenv").config()

accountCont.buildLogin = async function (req, res, next) {
    let nav = await utilities.getNav()
    let accountData = await utilities.getLoginCheck(req, res)
    //req.flash("notice", "message to be displayed if needed")
    res.render("account/login", {
        title: 'Login', 
        nav, accountData,
        errors: null,
    })
}

/* ****************************************
*  Deliver registration view
* *************************************** */
accountCont.buildRegister = async function(req, res, next) {
    let nav = await utilities.getNav()
    let accountData = await utilities.getLoginCheck(req, res)
    res.render("account/register", {
      title: "Register",
      nav, accountData,
      errors: null,
    })
}

/* ****************************************
*  Deliver Logged in view
* *************************************** */
accountCont.buildAccountManagment = async function(req, res, next) {
  let nav = await utilities.getNav()
  let accountData = await utilities.getLoginCheck(req, res)
  res.render("account/accountManagment", {
    title: "Account Managment",
    nav, accountData,
    errors: null
  })
}

/* ****************************************
*  Process Registration
* *************************************** */
accountCont.registerAccount = async function (req, res) {
    let nav = await utilities.getNav()
    let accountData = await utilities.getLoginCheck(req, res)
    const { account_firstname, account_lastname, account_email, account_password } = req.body
  
    // Hash the password before storing
    let hashedPassword
    try {
        // regular password and cost (salt is generated automatically)
        hashedPassword = await bcrypt.hashSync(account_password, 10)
    } catch (error) {
        req.flash("notice", 'Sorry, there was an error processing the registration.')
        res.status(500).render("account/register", {
        title: "Registration",
        nav, accountData,
        errors: null,
        })
    }

    const regResult = await accountModel.registerAccount(
      account_firstname,
      account_lastname,
      account_email,
      hashedPassword
    )

    if (regResult) {
      req.flash(
        "notice",
        `Congratulations, you\'re registered ${account_firstname}. Please log in.`
      )
      res.status(201).render("account/login", {
        title: "Login",
        nav, accountData,
        errors: null,
      })
    } else {
      req.flash("notice", "Sorry, the registration failed.")
      res.status(501).render("account/register", {
        title: "Registration",
        nav, accountData,
      })
    }
}

/* ****************************************
 *  Process login request
 * ************************************ */
accountCont.accountLogin = async function (req, res) {
  let nav = await utilities.getNav()
  let accountData = await utilities.getLoginCheck(req, res)
  const { account_email, account_password } = req.body
  const account_data = await accountModel.getAccountByEmail(account_email)
  if (!account_data) {
   req.flash("notice", "Please check your credentials and try again.")
   res.status(400).render("account/login", {
    title: "Login",
    nav, accountData,
    errors: null,
    account_email,
   })
    return
  }
  try {
   if (await bcrypt.compare(account_password, account_data.account_password)) {
   delete account_data.account_password
   const accessToken = jwt.sign(account_data, process.env.ACCESS_TOKEN_SECRET, { expiresIn: 3600 })
   if(process.env.NODE_ENV === 'development') {
     res.cookie("jwt", accessToken, { httpOnly: true, maxAge: 3600 * 1000 })
     } else {
       res.cookie("jwt", accessToken, { httpOnly: true, secure: true, maxAge: 3600 * 1000 })
     }
   return res.redirect("/account/")
   }
  } catch (error) {
   return new Error('Access Forbidden')
  }
}

/* ****************************************
 *  Process Logout request
 * ************************************ */
accountCont.logoutAccount = (req, res, next) => {
  res.clearCookie("jwt")
  return res.redirect("/")
}

/* ****************************************
 *  Build update account view
 * ************************************ */
accountCont.buildAccountUpdate = async (req, res, next) => {
  let nav = await utilities.getNav()
  let accountData = await utilities.getLoginCheck(req, res)

  const account_id = parseInt(req.params.account_id)

  const accountDetails = await accountModel.getAccountById(account_id)
  res.render("account/update-account", {
      title: 'Update Account Info', 
      nav, accountData,
      errors: null,
      account_firstname: accountDetails.account_firstname,
      account_lastname: accountDetails.account_lastname,
      account_email: accountDetails.account_email,
      account_id: account_id
  }) 
}

/* ****************************************
 *  Update account info
 * ************************************ */
accountCont.updateAccountInfo = async (req, res, next) => {
  let nav = await utilities.getNav()
  let accountData = await utilities.getLoginCheck(req, res)

  const {
    account_id,
    account_firstname,
    account_lastname,
    account_email
  } = req.body
  const updateResult = await accountModel.updateAccountInfo(
    account_firstname,
    account_lastname,
    account_email,
    account_id
  )

  if (updateResult) {
    req.flash("notice", "Account updated successfully")
    res.redirect("/account")
  } else {
    req.flash("notice", "Sorry, something went wrong")
    res.status(501).render("account/update-account", {
      title: 'Update Account Info', 
      nav, accountData,
      errors: null,
      account_firstname,
      account_lastname,
      account_email,
      account_id
    })
  }
}

/* ****************************************
 *  Update password
 * ************************************ */
accountCont.updatePassword = async (req, res, next) => {
  let nav = await utilities.getNav()
  let accountData = await utilities.getLoginCheck(req, res)

  const {
    account_id,
    account_password
  } = req.body
  
  // Hash the password before storing
  let hashedPassword
  try {
      // regular password and cost (salt is generated automatically)
      hashedPassword = await bcrypt.hashSync(account_password, 10)
  } catch (error) {
      req.flash("notice", 'Sorry, there was an error processing the registration.')
      res.status(500).render("account/update-account", {
      title: "Update Account",
      nav, accountData,
      errors: null,
      account_id
      })
  }

  const updateResult = await accountModel.updatePassword(
    hashedPassword,
    account_id
  )
  
  if (updateResult) {
    req.flash("notice", "Account updated successfully")
    res.redirect("/account")
  } else {
    req.flash("notice", "Sorry, something went wrong")
    res.status(501).render("account/update-account", {
      title: 'Update Account Info', 
      nav, accountData,
      errors: null,
      account_id
    })
  }
}

module.exports = accountCont