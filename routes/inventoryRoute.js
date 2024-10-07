// Needed Resources 
const express = require("express")
const router = new express.Router() 
const invController = require("../controllers/invController")

// Route to build inventory by classification view
router.get("/type/:classificationId", invController.buildByClassificationId);
// roite to build inventory by single car (inv_id)
router.get("/detail/:inv_id", invController.buildByInvId)

module.exports = router;