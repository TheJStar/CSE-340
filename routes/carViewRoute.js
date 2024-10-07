// Needed Resources 
const express = require("express")
const router = new express.Router() 
const carViewController = require("../controllers/carViewController")

// build car view by inv id
router.get("/detail/:inv_id", carViewController.buildByInvId)

module.exports = router;