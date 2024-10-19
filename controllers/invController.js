const { param } = require("express-validator")
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
  let accountData = await utilities.getLoginCheck(req, res)
  const className = data[0].classification_name
  res.render("./inventory/classification", {
    title: className + " vehicles",
    nav, accountData,
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
  let accountData = await utilities.getLoginCheck(req, res)
  const carName = data[0].inv_year + " " + data[0].inv_make + " " + data[0].inv_model
  res.render("./inventory/car", {
      title: carName,
      nav, accountData,
      carView
})
}

/* ***************************
 *  Build car inventory managment view
 * ************************** */
invCont.buildInvManagment = async function (req, res, next) {
  let nav = await utilities.getNav()
  let accountData = await utilities.getLoginCheck(req, res)
  const classificationSelect = await utilities.buildClassificationList()
  res.render("./inventory/management", {
      title: "Inventory Management",
      nav, accountData,
      errors: null,
      classificationSelect
})
}

/* ***************************
 *  Build car classification adding form view
 * ************************** */
invCont.buildAddClassification = async function (req, res, next) {
  let nav = await utilities.getNav()
  let accountData = await utilities.getLoginCheck(req, res)
  res.render("./inventory/add-classification", {
      title: "Add Classification",
      nav, accountData,
      errors: null
})
}

/* ***************************
 *  Build car adding form view
 * ************************** */
invCont.buildAddInventory = async function (req, res, next) {
  let nav = await utilities.getNav()
  let accountData = await utilities.getLoginCheck(req, res)
  let classificationList = await utilities.buildClassificationList()
  res.render("./inventory/add-inventory", {
      title: "Add Vehicle",
      nav, accountData,
      classificationList,
      errors: null
})
}

/* ***************************
 *  Procces for adding Classification
 * ************************** */
invCont.addClassificationName = async function (req, res) {
  let nav = await utilities.getNav()
  let accountData = await utilities.getLoginCheck(req, res)
  const { classification_name } = req.body

  const regResult = await invModel.addClassification(
    classification_name
  )

  if (regResult) {
    nav = await utilities.getNav()
    accountData = await utilities.getLoginCheck(req, res)
    req.flash(
      "notice",
      `Congratulations, you\'re were able to add ${classification_name} as a classification successfully.`
    )
    res.status(201).render("inventory/management", {
      title: "Inventory Management",
      nav, accountData,
      errors: null,
    })
  } else {
    req.flash("notice", "Sorry, the registration failed.")
    res.status(501).render("inventory/add-classification", {
      title: "Add Classification",
      nav, accountData,
    })
  }
}

/* ***************************
 *  Procces for adding Car
 * ************************** */
invCont.addInventory = async function (req, res) {
  let nav = await utilities.getNav()
  let accountData = await utilities.getLoginCheck(req, res)
  
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
      nav, accountData,
      errors: null,
    })
  } else {
    req.flash("notice", "Sorry, the registration failed.")
    res.status(501).render("inventory/add-inventory", {
      title: "Add Vehicle",
      nav, accountData,
      classificationList
    })
  }
}

/* ***************************
 *  Return Inventory by Classification As JSON
 * ************************** */
invCont.getInventoryJSON = async (req, res, next) => {
  const classification_id = parseInt(req.params.classification_id)
  const invData = await invModel.getInventoryByClassificationId(classification_id)
  if (invData[0].inv_id) {
    return res.json(invData)
  } else {
    next(new Error("No data returned"))
  }
}

/* ***************************
 *  Build car editing form view
 * ************************** */
invCont.buildEditInventory = async function (req, res, next) {
  const inv_id = parseInt(req.params.inv_id)
  let nav = await utilities.getNav()
  let accountData = await utilities.getLoginCheck(req, res)
  
  const itemData = (await invModel.getCarByInvId(inv_id))[0]
  let classificationList = await utilities.buildClassificationList(itemData.classification_id)
  const itemName = `${itemData.inv_make} ${itemData.inv_model}`
  res.render("./inventory/edit-inventory", {
      title: `Edit ${itemName}`,
      nav, accountData,
      classificationList,
      errors: null,
      inv_id: itemData.inv_id,
      inv_make: itemData.inv_make,
      inv_model: itemData.inv_model,
      inv_year: itemData.inv_year,
      inv_description: itemData.inv_description,
      inv_image: itemData.inv_image,
      inv_thumbnail: itemData.inv_thumbnail,
      inv_price: itemData.inv_price,
      inv_miles: itemData.inv_miles,
      inv_color: itemData.inv_color,
      classification_id: itemData.classification_id
})
}

/* ***************************
 *  Update Inventory Data
 * ************************** */
invCont.updateInventory = async function (req, res, next) {
  let nav = await utilities.getNav()
  let accountData = await utilities.getLoginCheck(req, res)
  
  const {
    inv_id,
    inv_make,
    inv_model,
    inv_description,
    inv_image,
    inv_thumbnail,
    inv_price,
    inv_year,
    inv_miles,
    inv_color,
    classification_id,
  } = req.body
  const updateResult = await invModel.updateInventory(
    inv_id,  
    inv_make,
    inv_model,
    inv_description,
    inv_image,
    inv_thumbnail,
    inv_price,
    inv_year,
    inv_miles,
    inv_color,
    classification_id
  )

  if (updateResult) {
    const itemName = updateResult.inv_make + " " + updateResult.inv_model
    req.flash("notice", `The ${itemName} was successfully updated.`)
    res.redirect("/inv/")
  } else {
    const classificationSelect = await utilities.buildClassificationList(classification_id)
    const itemName = `${inv_make} ${inv_model}`
    req.flash("notice", "Sorry, the insert failed.")
    res.status(501).render("inventory/edit-inventory", {
    title: "Edit " + itemName,
    nav, accountData,
    classificationSelect: classificationSelect,
    errors: null,
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
  }
}

/* ***************************
 *  Build car Deleting form view
 * ************************** */
invCont.buildDeleteInventory = async function (req, res, next) {
  const inv_id = parseInt(req.params.inv_id)
  let nav = await utilities.getNav()
  let accountData = await utilities.getLoginCheck(req, res)
  
  const itemData = (await invModel.getCarByInvId(inv_id))[0]
  const itemName = `${itemData.inv_make} ${itemData.inv_model}`
  res.render("./inventory/delete-confirm", {
      title: `Delete ${itemName}`,
      nav, accountData,
      errors: null,
      inv_id: itemData.inv_id,
      inv_make: itemData.inv_make,
      inv_model: itemData.inv_model,
      inv_year: itemData.inv_year,
      inv_price: itemData.inv_price,
})
}

/* ***************************
 *  Delete Inventory Data
 * ************************** */
invCont.deleteInventory = async function (req, res, next) {
  let nav = await utilities.getNav()
  let accountData = await utilities.getLoginCheck(req, res)
  
  const {
    inv_id,
    inv_make,
    inv_model,
    inv_year,
    inv_price
  } = req.body

  const deleteResult = await invModel.deleteInventory(inv_id)

  if (deleteResult) {
    const itemName = inv_make + " " + inv_model
    req.flash("notice", `The ${itemName} was successfully deleted.`)
    res.redirect("/inv/")
  } else {
    const itemName = `${inv_make} ${inv_model}`
    req.flash("notice", "Sorry, the deletetion failed.")
    res.status(501).render("inventory/delete-confirm", {
    title: "Delete " + itemName,
    nav, accountData,
    errors: null,
    inv_id,
    inv_make,
    inv_model,
    inv_year,
    inv_price,
    })
  }
}

module.exports = invCont