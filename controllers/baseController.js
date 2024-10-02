const utilities = require("../utilities/")
const baseController = {}

baseController.buildHome = async function(req, res){
  const nav = await utilities.getNav()
  res.render("index", {title: "Home", nav})// this is where you can add all of the variables as pair values like ...{title: "Home", newVar: "value"}) and then use it in the .ejs files by <%- newVar %> || don't use body as a variable because it will replace the default value of the index.ejs
}

module.exports = baseController