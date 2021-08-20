const moment = require("moment");
const database = require("../helper/db.js");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const nodemailer = require("nodemailer")

let mailTransport = nodemailer.createTransport({
    "service": "gmail",
    "auth": {
        user: "ponraj1602309@gmail.com",
        pass: "8122817166"
    }
})

const user = database.users;
const order = database.orders;
const food = database.foods;

module.exports = {
    register,
    login,
    forgetPassword,
    changePassword,
    logout,
    orderFood
}

function sendMail(data) {
    let mailData = {
        from: "ponraj1602309@gmail.com",
        to: data.to,
        subject: data.subject,
        html: data.html,
    }
    console.log("sendMail" + mailData.to)
    mailTransport.sendMail(mailData, function(err, data) {
        if (err) {
            console.log("Error")
        } else {
            console.log("Email sent")
        }
    })
}

async function register(req, res, next) {
    let name = req.body.name;
    let email = req.body.email;
    let mobile = req.body.mobile;
    let password = req.body.password;
    const email_detail = await user.find({ "email": email }).exec();
    if (email_detail.length > 0) {
        throw res.json({ "status": "Failed", "message": "email already exists" });
    }
    const mobile_Availab = await user.find({ "mobile": mobile }).exec()
    if (mobile_Availab.length > 0) {
        throw res.json({ "status": "Failed", "message": "Mobile already exists" });
    }
    let users = new user(req.body);
    if (req.body.password) {
        let password = req.body.password;
        let salt = await bcrypt.genSalt(10);
        users.password = bcrypt.hashSync(password, salt);
        let details = {
            to: email,
            subject: "Test function",
            html: '<p>Thank you for your registration.  Please click the below link to activate your account.<br> Please find below the login credentials.<br>Mobile Number:<br> Password:</p>'
        }
        console.log(details);
        sendMail(details)
        users.save();

        res.json({ "status": "Success", "message": "Register successfully" });
    } else {
        res.json({ "status": "Failed", "message": "Please Provide password" });
    }
}

async function login(req, res, next) {
    let email = req.body.email;
    let password = req.body.password;
    let users = await user.findOne({ "email": email }).exec();
    let pwd = users.password;
    let match = await bcrypt.compare(password, pwd);
    let payload = { users: { id: users.uuid } }
    let signature = "randomString";
    let token = jwt.sign(payload, signature, { expiresIn: 10000 });

    let data = await user.findOneAndUpdate({ email: email }, { login_status: true, verify_token: token }, { new: true }).exec();

    if (match) {
        res.json({ "status": "Success", "message": "Login successfully", "data": data });
    } else {
        res.json({ "status": "Failed", "message": "name or password wrong" });
    }
}

async function forgetPassword(req, res, next) {
    try {
        let email = req.query.email;
        let NewPassword = req.query.password;
        let users = await user.findOne({ "email": email }).exec();
        let salt = await bcrypt.genSalt(10);
        let pass = bcrypt.hashSync(NewPassword, salt);
        const data = await user.findOneAndUpdate({ email: email }, { password: pass }, { new: true }).exec()
        res.json({ "status": "Success", "message": "Password changed", "data": data });
    } catch (err) {
        res.json({ "status": "Failed", "message": err.message });
    }
};

async function changePassword(req, res, next) {
    let email = req.query.email;
    let oldpassword = req.query.password;
    let NewPassword = req.query.new_password;
    let users = await user.findOne({ "email": email }).exec();
    let pass = users.password;
    let match = await bcrypt.compare(oldpassword, pass);
    if (!match) {
        res.json({ "status": "Failed", "message": "Please enter the correct password" });
    } else {
        let salt = await bcrypt.genSalt(10);
        let pass = bcrypt.hashSync(NewPassword, salt);
        const data = await user.findOneAndUpdate({ email: email }, { password: pass }, { new: true }).exec()
        res.json({ "status": "Success", "message": "Password changed", "data": data });
    }
}

async function logout(req, res, next) {
    let email = req.query.email;
    await user.findOneAndUpdate({ email: email }, { login_status: false, verify_token: "" }, { new: true }).exec();
    res.json({ "status": "Success", "message": "logout successfully" });
}

async function orderFood(req, res, next) {
    let email = req.body.email;
    let foodname = req.body.foodname;
    const email_check = await user.find({ "email": email }).exec();
    if (!email_check.length > 0) {
        throw res.json({ "status": "Failed", "message": "You Are Not Registered" });
    }
    const food_check = await food.find({ "foodname": foodname }).exec();
    if (!food_check.length > 0) {
        throw res.json({ "status": "Failed", "message": "This Food is Not Available" });
    }
    let order_detail = new order(req.body);
    if (order_detail.save()) {
        let order_food = {
            to: email,
            subject: "Food Park",
            html: '<p>Thank you for your Order.<br> Please Wait For Your Order Conformation.</p>'
        }
        console.log(order_food);
        sendMail(order_food),
            res.json({ "status": "Success", "message": "Food Order successfully" });
    } else {
        res.json({ "status": "Failed", "message": "Please Select The food And Order" });
    }

}