const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const crypto = require("crypto");

const userSchema = new Schema({
    uuid: { type: String, unique: true },
    name: { type: String, required: true },
    email: { type: String, required: true },
    mobile: { type: String, required: true },
    password: { type: String, required: true },
    role: { type: String, required: false },
    verify_token: { type: String, required: false },
    login_status: { type: Boolean, required: false }

}, {
    timestamps: true
});

userSchema.pre("save", function(next) {
    this.uuid = "USR" + crypto.pseudoRandomBytes(6).toString('hex').toUpperCase();
    next();
})

module.exports = mongoose.model('user', userSchema);