const utilities = require("../utilities/index")
const accountModel = require('../models/account-model');
const jwt = require("jsonwebtoken")
const bcrypt = require('bcrypt');
const { body } = require("express-validator");
require("dotenv").config()


const accountCont = {}

/* ****************************************
*  Deliver login view
* *************************************** */
accountCont.buildAccountManagement = async function (req, res, next) {
    let nav = await utilities.getNav()
    let accountManagement = await utilities.buildAccountManagement()
    res.render("account/management", {
        title: "My Account",
        nav,
        accountManagement,
        errors: null,
    })
}

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

accountCont.buildRegister = async function (req, res, next) {
    let nav = await utilities.getNav()
    const register = await utilities.buildRegister()

    res.render("account/register", {
        title: "Register",
        nav,
        register,
        errors: null,
    })
}

accountCont.registerAccount = async function (req, res) {
    let nav = await utilities.getNav()
    const register = await utilities.buildRegister()
    const login = await utilities.buildLogin()
    const { account_firstname, account_lastname, account_email, account_password } = req.body

    const hashedPassword = await bcrypt.hash(account_password, 10);
    const regResult = await accountModel.registerAccount(
        account_firstname,
        account_lastname,
        account_email,
        hashedPassword,
    )


    if (regResult) {
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

/* ****************************************
 *  Process login request
 * ************************************ */
accountCont.accountLogin = async (req, res) => {
    let nav = await utilities.getNav()
    const { account_email, account_password } = req.body
    const accountData = await accountModel.getAccountByEmail(account_email)
    if (!accountData) {
        req.flash("notice", "Please check your credentials and try again.")
        res.status(400).render("account/login", {
            title: "Login",
            nav,
            errors: null,
            account_email,
        })
        return
    }
    try {
        console.log(account_password + "   " + accountData.account_password);
        if (await bcrypt.compare(account_password, accountData.account_password)) {
            console.log("It worked")
            delete accountData.account_password
            const accessToken = jwt.sign(accountData, process.env.ACCESS_TOKEN_SECRET, { expiresIn: 3600 * 1000 })
            res.cookie("jwt", accessToken, { httpOnly: true, maxAge: 3600 * 1000 })
            return res.redirect("/account/")
        }
    } catch (error) {
        return new Error('Access Forbidden')
    }
}

accountCont.accountLogout = async (req, res) => {
    const nav = await utilities.getNav()
    utilities.checkJWTToken()
    const { account_firstname } = req.body
    if (res.locals.loggedin == 1) {
        res.status(201).render("partials/header", {
            title: "Login",
            user: account_firstname,
            nav,
            login,
            errors: null,
        })
    }
}
module.exports = accountCont
