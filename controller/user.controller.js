const express = require("express");
const router = express.Router();
const userService = require("./user.service.js");
const auth = require("../helper/middleware/auth.js")

router.post('/register', userService.register);
router.post('/login', userService.login);
router.put('/changePassword', auth, userService.changePassword);
router.put('/forgetPassword', userService.forgetPassword);
router.put('/logout', userService.logout);
router.post('/orderFood', userService.orderFood);

module.exports = router;