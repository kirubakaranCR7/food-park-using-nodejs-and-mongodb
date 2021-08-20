const mongoose = require("mongoose")
const Schema = mongoose.Schema;
const crypto = require("crypto");

const orderSchema = new Schema({
    uuid: { type: String, unique: true },
    email: { type: String, required: true },
    foodname: { type: String, required: true },
    verify_food: { type: Boolean, required: false }

}, {
    timestamps: true
});

orderSchema.pre("save", function(next) {
    this.uuid = "USR" + crypto.pseudoRandomBytes(6).toString('hex').toUpperCase();
    next();
})

module.exports = mongoose.model('order', orderSchema);