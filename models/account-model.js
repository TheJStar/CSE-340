const pool = require("../database/")
const accountModel = {}

/* *****************************
*   Register new account
* *************************** */
accountModel.registerAccount = async function (account_firstname, account_lastname, account_email, account_password){
    try {
      const sql = "INSERT INTO account (account_firstname, account_lastname, account_email, account_password, account_type) VALUES ($1, $2, $3, $4, 'Client') RETURNING *"
      return await pool.query(sql, [account_firstname, account_lastname, account_email, account_password])
    } catch (error) {
      return error.message
    }
}

/* **********************
 *   Check for existing email
 * ********************* */
accountModel.checkExistingEmail = async function (account_email){
    try {
      const sql = "SELECT * FROM account WHERE account_email = $1"
      const email = await pool.query(sql, [account_email])
      return email.rowCount
    } catch (error) {
      return error.message
    }
}

/* **********************
 *   Check for existing email excluding the person changing email by id
 * ********************* */
accountModel.checkExistingEmailForUpdate = async function (account_email, account_id){
  try {
    const sql = "SELECT * FROM account WHERE account_email = $1 AND account_id<>$2"
    const email = await pool.query(sql, [account_email, account_id])
    return email.rowCount
  } catch (error) {
    return error.message
  }
}

/* **********************
 *   Check for existing password with the right email
 * ********************* */
accountModel.checkExistingCredentials = async function (account_email, account_password){
    try {
      const sql = "SELECT * FROM account WHERE account_email = $1 AND account_password = $2"
      const email = await pool.query(sql, [account_email, account_password])
      return email
    } catch (error) {
      return error.message
    }
}

/* *****************************
* Return account data using email address
* ***************************** */
accountModel.getAccountByEmail = async function (account_email) {
  try {
    const result = await pool.query(
      'SELECT account_id, account_firstname, account_lastname, account_email, account_type, account_password FROM account WHERE account_email = $1',
      [account_email])
    return result.rows[0]
  } catch (error) {
    return new Error("No matching email found")
  }
}

accountModel.getAccountById = async function (account_id) {
  try {
    const result = await pool.query(
      "SELECT * FROM public.account WHERE account_id=$1",
      [account_id]
    )
    return result.rows[0]
  } catch (error) {
    return new Error("Account doesn't exist")
  }
}

/* *****************************
* Update account data first, last names and email by id
* ***************************** */
accountModel.updateAccountInfo = async function (account_firstname, account_lastname, account_email, account_id) {
  try {
    const result = await pool.query(
      "UPDATE public.account SET account_firstname = $1, account_lastname = $2, account_email = $3 WHERE account_id=$4 RETURNING *",
      [account_firstname, account_lastname, account_email, account_id]
    )
    return result.rows[0]
  } catch (error) {
    return new Error("Update failed")
  }
}

/* *****************************
* Update password by id
* ***************************** */
accountModel.updatePassword = async function (account_password, account_id) {
  try {
    const result = await pool.query(
      "UPDATE public.account SET account_password = $1 WHERE account_id = $2 RETURNING *",
      [account_password, account_id]
    )
    return result.rows[0]
  } catch (error) {
    return new Error("Update failed")
  }
}

module.exports = accountModel