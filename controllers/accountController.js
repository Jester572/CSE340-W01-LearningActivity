const utilities = require("../utilities/index")
const accModel = require('../models/account-model');

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
      errors: null,
    })
  }

accountCont.buildRegister = async function(req, res, next) {
    let nav = await utilities.getNav()
    const register = await utilities.buildRegister()

    res.render("account/register", {
        title: "Register",
        nav,
        register,
        errors: null,
    })
}

accountCont.registerAccount = async function(req, res) {
    let nav = await utilities.getNav()
    const register = await utilities.buildRegister()
    const login = await utilities.buildLogin()
    const { account_firstname, account_lastname, account_email, account_password } = req.body

    const regResult = await accModel.registerAccount(
        account_firstname,
        account_lastname,
        account_email,
        account_password
    )

    
    if (regResult) {
        console.log("True")
        req.flash(
            "notice",
            `Congratulations, you\'re registered ${account_firstname}. Please log in.`
        )
        res.status(201).render("account/login", {
            title: "Login",
            nav,
            login,
            errors: null,
        })
    } else {
        console.log("False")
        req.flash("notice", "Sorry, the registration failed.")
        res.status(501).render("account/register", {
            title: "Registration",
            nav,
            register,
            errors: null,
        })
    }
}

  module.exports = accountCont