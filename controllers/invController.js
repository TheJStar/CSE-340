const invModel = require("../models/inventory-model")
const utilities = require("../utilities/")

const invCont = {}

/* ***************************
 *  Build inventory by classification view
 * ************************** */
invCont.buildByClassificationId = async function (req, res, next) {
  const classification_id = req.params.classificationId
  const data = await invModel.getInventoryByClassificationId(classification_id)
  const grid = await utilities.buildClassificationGrid(data)
  let nav = await utilities.getNav()
  const className = data[0].classification_name
  res.render("./inventory/classification", {
    title: className + " vehicles",
    nav,
    grid,
  })
}

/* ***************************
 *  Build car view by inv_id
 * ************************** */
invCont.buildByInvId = async function (req, res, next) {
  const inv_id = req.params.inv_id
  const data = await invModel.getCarByInvId(inv_id)
  const carView = await utilities.buildCarView(data)
  let nav = await utilities.getNav()
  const carName = data[0].inv_year + " " + data[0].inv_make + " " + data[0].inv_model
  res.render("./inventory/car", {
      title: carName,
      nav,
      carView
})
}

/* ***************************
 *  Build car inventory managment view
 * ************************** */
invCont.buildInvManagment = async function (req, res, next) {
  let nav = await utilities.getNav()
  res.render("./inventory/management", {
      title: "Inventory Management",
      nav,
      errors: null
})
}

/* ***************************
 *  Build car classification adding form
 * ************************** */
invCont.buildAddClassification = async function (req, res, next) {
  let nav = await utilities.getNav()
  res.render("./inventory/add-classification", {
      title: "Add Classification",
      nav,
      errors: null
})
}

/* ***************************
 *  Build car adding form
 * ************************** */
invCont.buildAddInventory = async function (req, res, next) {
  let nav = await utilities.getNav()
  let classificationList = await utilities.buildClassificationList()
  res.render("./inventory/add-inventory", {
      title: "Add Vehicle",
      nav,
      classificationList,
      errors: null
})
}

/* ***************************
 *  Procces for adding Classification
 * ************************** */
invCont.addClassificationName = async function (req, res) {
  let nav = await utilities.getNav()
  const { classification_name } = req.body

  const regResult = await invModel.addClassification(
    classification_name
  )

  if (regResult) {
    nav = await utilities.getNav()
    req.flash(
      "notice",
      `Congratulations, you\'re were able to add ${classification_name} as a classification successfully.`
    )
    res.status(201).render("inventory/management", {
      title: "Inventory Management",
      nav,
      errors: null,
    })
  } else {
    req.flash("notice", "Sorry, the registration failed.")
    res.status(501).render("inventory/add-classification", {
      title: "Add Classification",
      nav,
    })
  }
}

/* ***************************
 *  Procces for adding Car
 * ************************** */
invCont.addInventory = async function (req, res) {
  let nav = await utilities.getNav()
  const { inv_make, inv_model, inv_year, inv_description, inv_image, inv_thumbnail, inv_price, inv_miles, inv_color, classification_id } = req.body
  let classificationList = await utilities.buildClassificationList(classification_id)

  const regResult = await invModel.addCar(
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
  )

  if (regResult) {
    req.flash(
      "notice",
      `Congratulations, you\'re were able to at the Vehicle: ${inv_make} ${inv_model} successfully.`
    )
    res.status(201).render("inventory/management", {
      title: "Inventory Management",
      nav,
      errors: null,
    })
  } else {
    req.flash("notice", "Sorry, the registration failed.")
    res.status(501).render("inventory/add-inventory", {
      title: "Add Vehicle",
      nav,
      classificationList
    })
  }
}

module.exports = invCont