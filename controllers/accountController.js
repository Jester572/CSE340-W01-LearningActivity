const utilities = require("../utilities/")

const accountCont = {}

/* ****************************************
*  Deliver login view
* *************************************** */
accountCont.buildLogin = async function (req, res, next) {
    let nav = await utilities.getNav()
    const login = await utilities.buildLogin()
    res.render("account/login", {
      title: "Login",
      nav,
      login,
    })
  }
  
  module.exports = accountCont