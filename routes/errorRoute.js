// Needed Resources 
const express = require("express")
const router = new express.Router() 
const errorController = require("../controllers/errorController")

// make error
router.get("/broken", utilities.handleErrors(errorController.makeError))

module.exports = router;