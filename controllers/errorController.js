const errorController = {}

errorController.makeError = async function(req, res){
  res.render("index", {title: "Home", nav, accountData})// no nav so error will occure
}

module.exports = errorController