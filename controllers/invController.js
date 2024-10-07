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

module.exports = invCont