// Needed Resources 
const express = require("express")
const router = new express.Router() 
const invController = require("../controllers/invController");
const utils = require("pg/lib/utils");
const utilities = require("../utilities")
const invValidate = require("../utilities/inventory-validation")

// Route to build inventory by classification view
router.get("/type/:classificationId", utilities.handleErrors(invController.buildByClassificationId));
// Route to build inventory by classification view
router.get("/search", utilities.handleErrors(invController.buildSearch));
// route to build inventory by single car (inv_id)
router.get("/detail/:inv_id", utilities.handleErrors(invController.buildByInvId))
// route to inventory managing view
router.get("/", utilities.checkLogin, utilities.checkAuthority, utilities.handleErrors(invController.buildInvManagment))
// route to adding classification form view
router.get("/add-classification", utilities.checkLogin, utilities.checkAuthority, utilities.handleErrors(invController.buildAddClassification))
router.post(
    "/add-classification",
    invValidate.addClassificationRules(),
    invValidate.checkClassificationData,
    utilities.handleErrors(invController.addClassificationName)
)
// route to add car form view
router.get("/add-inventory", utilities.checkLogin, utilities.checkAuthority, utilities.handleErrors(invController.buildAddInventory))
router.post(
    "/add-inventory",
    invValidate.addCarRules(),
    invValidate.checkCarData,
    utilities.handleErrors(invController.addInventory)
)
// get car data by classification id
router.get("/getInventory/:classification_id", utilities.handleErrors(invController.getInventoryJSON))
// get car data by search string
router.get("/getInv/:search_string", utilities.handleErrors(invController.getInventoryJSONSearchString))
// route to edit car view
router.get("/edit/:inv_id", utilities.checkLogin, utilities.checkAuthority, utilities.handleErrors(invController.buildEditInventory))
// route to update
router.post(
    "/update/",
    invValidate.addCarRules(),
    invValidate.checkUpdateData,
    utilities.handleErrors(invController.updateInventory))
// route to delete car view
router.get("/delete/:inv_id", utilities.checkLogin, utilities.checkAuthority, utilities.handleErrors(invController.buildDeleteInventory))
// route to delete
router.post("/delete", utilities.handleErrors(invController.deleteInventory))

module.exports = router;