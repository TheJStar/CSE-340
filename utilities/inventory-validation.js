const utilities = require(".")
const { body, validationResult } = require("express-validator")
const validate = {}
const invModel = require("../models/inventory-model")

/* ***************************
 *  Validation for adding car classification form
 * ************************** */
validate.addCarRules = () => {
    return [
      // Make is required and must be string
      body("inv_make")
        .trim()
        .escape()
        .notEmpty()
        .isLength({ min: 3 })
        .withMessage("Please provide a Make."), // on error this message is sent.
  
      // Model is required and must be string
      body("inv_model")
        .trim()
        .escape()
        .notEmpty()
        .isLength({ min: 3 })
        .withMessage("Please provide a Model."), // on error this message is sent.
        
      // price is required and must be string
      body("inv_price")
      .trim()
      .escape()
      .notEmpty()
      .isNumeric()
      .withMessage("Please provide a price."), // on error this message is sent.
    
      // miles are required and must be string
      body("inv_miles")
      .trim()
      .escape()
      .notEmpty()
      .isInt()
      .withMessage("Please provide the miles."), // on error this message is sent.
    
      // color is required and must be string
      body("inv_color")
      .trim()
      .escape()
      .notEmpty()
      .withMessage("Please provide a color."), // on error this message is sent.

      // Year is required and must be string
      body("inv_year")
      .trim()
      .escape()
      .notEmpty()
      .isInt()
      .isLength({ min: 4, max: 4})
      .withMessage("Please provide a year."), // on error this message is sent.

      // image is required and must be string
      body("inv_image")
      .trim()
      .notEmpty()
      .withMessage("Please provide a path to a image."), // on error this message is sent.
    
      // thumbnail is required and must be string
      body("inv_thumbnail")
      .trim()
      .notEmpty()
      .withMessage("Please provide a path to a thumbnail."), // on error this message is sent.
    
      // description is required and must be string
      body("inv_description")
      .trim()
      .notEmpty()
      .withMessage("Please provide a description."), // on error this message is sent.
    
      // classification id is required and must be string
      body("classification_id")
      .trim()
      .escape()
      .notEmpty()
      .withMessage("Please choose a classification."), // on error this message is sent.
    ]
}

/* ***************************
 *  Validation for car adding form
 * ************************** */
validate.addClassificationRules = () => {
    return [    
      // Classification ame is required and must be string
      body("classification_name")
      .trim()
      .escape()
      .notEmpty()
      .isAlpha()
      .withMessage("Please write a classification and only use letters.") // on error this message is sent.
      .custom(async (classification_name) => {
        const classificationExists = await invModel.checkExistingClassification(classification_name)
        if (classificationExists) {
            throw new Error("The Classification exists, try something new")
        }
      }),
    ]
}

/* ***************************
 *  Check the Vehicle data
 * ************************** */
validate.checkCarData = async (req, res, next) => {
    const { inv_make, inv_model, inv_year, inv_description, inv_image, inv_thumbnail, inv_price, inv_miles, inv_color, classification_id } = req.body
    let errors = []
    errors = validationResult(req)
    if (!errors.isEmpty()) {
      let nav = await utilities.getNav()
      let classificationList = await utilities.buildClassificationList(classification_id)
      res.render("inventory/add-inventory", {
        errors,
        title: "Add inventory",
        nav,
        classificationList,
        inv_make, 
        inv_model, 
        inv_year, 
        inv_description, 
        inv_image, 
        inv_thumbnail, 
        inv_price, 
        inv_miles, 
        inv_color, 
        classification_id        
      })
      return
    }
    next()
}

/* ***************************
 *  Check the Vehicle data for updateing
 * ************************** */
validate.checkUpdateData = async (req, res, next) => {
  const { inv_id, inv_make, inv_model, inv_year, inv_description, inv_image, inv_thumbnail, inv_price, inv_miles, inv_color, classification_id } = req.body
  let errors = []
  errors = validationResult(req)
  if (!errors.isEmpty()) {
    let nav = await utilities.getNav()
    let classificationList = await utilities.buildClassificationList(classification_id)
    res.render("inventory/edit-inventory", {
      errors,
      title: `Edit ${inv_make} ${inv_model}`,
      nav,
      classificationList,
      inv_id,
      inv_make, 
      inv_model, 
      inv_year, 
      inv_description, 
      inv_image, 
      inv_thumbnail, 
      inv_price, 
      inv_miles, 
      inv_color, 
      classification_id        
    })
    return
  }
  next()
}

/* ***************************
 *  Check the classification data
 * ************************** */
validate.checkClassificationData = async (req, res, next) => {
    const { classification_name } = req.body
    let errors = []
    errors = validationResult(req)
    if (!errors.isEmpty()) {
      let nav = await utilities.getNav()
      res.render("inventory/add-classification", {
        errors,
        title: "Add Classification",
        nav,
        classification_name       
      })
      return
    }
    next()
}

module.exports = validate