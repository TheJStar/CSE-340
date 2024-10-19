const utilities = require(".")
const { body, validationResult } = require("express-validator")
const validate = {}
const accountModel = require("../models/account-model")

/*  **********************************
  *  Registration Data Validation Rules
  * ********************************* */
validate.registationRules = () => {
    return [
      // firstname is required and must be string
      body("account_firstname")
        .trim()
        .escape()
        .notEmpty()
        .isLength({ min: 1 })
        .withMessage("Please provide a first name."), // on error this message is sent.
  
      // lastname is required and must be string
      body("account_lastname")
        .trim()
        .escape()
        .notEmpty()
        .isLength({ min: 2 })
        .withMessage("Please provide a last name."), // on error this message is sent.
  
      // valid email is required and cannot already exist in the DB
      body("account_email")
      .trim()
      .escape()
      .notEmpty()
      .isEmail()
      .normalizeEmail() // refer to validator.js docs
      .withMessage("A valid email is required.")
      .custom(async (account_email) => {
        const emailExists = await accountModel.checkExistingEmail(account_email)
        if (emailExists) {
            throw new Error("Email exists. Please log in or use different email")
        }
      }),
  
      // password is required and must be strong password
      body("account_password")
        .trim()
        .notEmpty()
        .isStrongPassword({
          minLength: 12,
          minLowercase: 1,
          minUppercase: 1,
          minNumbers: 1,
          minSymbols: 1,
        })
        .withMessage("Password does not meet requirements."),
    ]
}

/* ******************************
 * Check data and return errors or continue to registration
 * ***************************** */
validate.checkRegData = async (req, res, next) => {
    const { account_firstname, account_lastname, account_email } = req.body
    let errors = []
    errors = validationResult(req)
    if (!errors.isEmpty()) {
      let nav = await utilities.getNav()
      let accountData = await utilities.getLoginCheck(req, res)
      res.render("account/register", {
        errors,
        title: "Registration",
        nav,
        account_firstname,
        account_lastname,
        account_email,
        accountData
      })
      return
    }
    next()
}

/*  **********************************
  *  Registration Data Validation Rules
  * ********************************* */
validate.loginRules = () => {
    let accountEmail
    return [
      // an existing email is required
      body("account_email")
      .trim()
      .escape()
      .notEmpty()
      .isEmail()
      .normalizeEmail() // refer to validator.js docs
      .withMessage("An existing email is required.")
      .custom(async (account_email) => {
        const emailExists = await accountModel.checkExistingEmail(account_email)
        if (!emailExists) {
            throw new Error("Email doesn't exists")
        } else {
            accountEmail = account_email
        }
      }),
  
      // password is required that matches the email
      body("account_password")
        .trim()
        .notEmpty()
        .isStrongPassword({
            minLength: 12,
            minLowercase: 1,
            minUppercase: 1,
            minNumbers: 1,
            minSymbols: 1,
        })
        .withMessage("Incorrect password"),
        // .custom(async (account_password) => {
        //     const credsExists = await accountModel.checkExistingCredentials(accountEmail, account_password).rowCount
        //     if (!credsExists) {
        //         throw new Error("The password is incorrect")
        //     }
        // }), // the account email doesn't exists
    ]
}

/* ******************************
 * Check data and return errors or continue to registration
 * ***************************** */
validate.checkLoginData = async (req, res, next) => {
    const { account_email } = req.body
    let errors = []
    errors = validationResult(req)
    if (!errors.isEmpty()) {
      let nav = await utilities.getNav()
      let accountData = await utilities.getLoginCheck(req, res)
      res.render("account/login", {
        errors,
        title: "Login",
        nav,
        account_email,
        accountData
      })
      return
    }
    next()
}

/*  **********************************
  *  Update Data Validation Rules
  * ********************************* */
validate.updateRules = () => {
  let account_id
  return [
    // firstname is required and must be string
    body("account_firstname")
      .trim()
      .escape()
      .notEmpty()
      .isLength({ min: 1 })
      .withMessage("Please provide a first name."), // on error this message is sent.

    // lastname is required and must be string
    body("account_lastname")
      .trim()
      .escape()
      .notEmpty()
      .isLength({ min: 2 })
      .withMessage("Please provide a last name."), // on error this message is sent.
    
    body("account_id")
      .custom(async (accountId) => {account_id = accountId}),

    // valid email is required and cannot already exist in the DB
    body("account_email")
    .trim()
    .escape()
    .notEmpty()
    .isEmail()
    .normalizeEmail() // refer to validator.js docs
    .withMessage("A valid email is required.")
    .custom(async (account_email) => {
      const emailExists = await accountModel.checkExistingEmailForUpdate(account_email, account_id)
      if (emailExists) {
          throw new Error("Email already exists. Please different email")
      }
    })
  ]
}

/* ******************************
* Check data and return errors or continue to update
* ***************************** */
validate.checkUpdateData = async (req, res, next) => {
  const { account_firstname, account_lastname, account_email, account_id } = req.body
  let errors = []
  errors = validationResult(req)
  if (!errors.isEmpty()) {
    let nav = await utilities.getNav()
    let accountData = await utilities.getLoginCheck(req, res)
    res.render("account/update-account", {
      errors,
      title: "Update Account",
      nav,
      account_firstname,
      account_lastname,
      account_email,
      account_id,
      accountData
    })
    return
  }
  next()
}

/*  **********************************
  *  Update password Validation Rules
  * ********************************* */
validate.updatePasswordRules = () => {
  return [
    // password is required and must be strong password
    body("account_password")
      .trim()
      .notEmpty()
      .isStrongPassword({
        minLength: 12,
        minLowercase: 1,
        minUppercase: 1,
        minNumbers: 1,
        minSymbols: 1,
      })
      .withMessage("Password does not meet requirements."),
  ]
}

/* ******************************
* Check password and return errors or continue to update
* ***************************** */
validate.checkUpdatePasswordData = async (req, res, next) => {
  const { account_firstname, account_lastname, account_email, account_id } = req.body
  let errors = []
  errors = validationResult(req)
  if (!errors.isEmpty()) {
    let nav = await utilities.getNav()
    let accountData = await utilities.getLoginCheck(req, res)
    res.render("account/update-account", {
      errors,
      title: "Update Account",
      nav,
      account_firstname,
      account_lastname,
      account_email,
      account_id,
      accountData
    })
    return
  }
  next()
}

module.exports = validate