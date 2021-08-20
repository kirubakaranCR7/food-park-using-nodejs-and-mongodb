const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const crypto = require("crypto");

const foodSchema = new Schema({
    uuid: { type: String, unique: true },
    foodname: { type: String, required: true },
    category: { type: String, required: true },
    details: { type: String, required: true },
    verify_token: { type: String, required: false }

}, {
    timestamps: true
});


foodSchema.pre("save", function(next) {
    this.uuid = "USR" + crypto.pseudoRandomBytes(6).toString('hex').toUpperCase();
    next();
})

module.exports = mongoose.model('food', foodSchema);