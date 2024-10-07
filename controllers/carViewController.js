const invModel = require("../models/inventory-model")
const utilities = require("../utilities/")

const carCont = {}

/* ***************************
 *  Build car view by inv_id
 * ************************** */
carCont.buildByInvId = async function (req, res, next) {
    const inv_id = req.params.inv_id
    const data = await invModel.getCarByInvId(inv_id)
    const carView = await utilities.buildCarView(data)
    let nav = await utilities.getNav()
    const carName = data[0].inv_year + " " + data[0].inv_make + " " + data[0].inv_model
    res.render("./car/car", {
        title: carName,
        nav,
        carView
  })
}

module.exports = carCont;