// Needed Resources 
const express = require("express")
const router = new express.Router() 
const invController = require("../controllers/invController");
const utils = require("pg/lib/utils");
const utilities = require("../utilities")
const invValidate = require("../utilities/inventory-validation")

// Route to build inventory by classification view
router.get("/type/:classificationId", invController.buildByClassificationId);
// route to build inventory by single car (inv_id)
router.get("/detail/:inv_id", invController.buildByInvId)
// route to inventory managing view
router.get("/", invController.buildInvManagment)
// route to adding classification form view
router.get("/add-classification", invController.buildAddClassification)
router.post(
    "/add-classification",
    invValidate.addClassificationRules(),
    invValidate.checkClassificationData,
    utilities.handleErrors(invController.addClassificationName)
)
// route to add car form view
router.get("/add-inventory", invController.buildAddInventory)
router.post(
    "/add-inventory",
    invValidate.addCarRules(),
    invValidate.checkCarData,
    utilities.handleErrors(invController.addInventory)
)

module.exports = router;