const moment = require("moment");
const database = require("../helper/db.js");


const food = database.foods;

module.exports = {
    addFoodDetails,
    getFoodDetails,
    getOneFoodDetails,
    updateFood,
    deleteFood
}


async function addFoodDetails(req, callback) {
    let food_details = new food(req);
    await food_details.save().then((data) => {
        callback(data);
    });
};

async function getFoodDetails(req, callback) {
    await food.find().exec().then((data) => {
        callback(data);
    });
};

async function getOneFoodDetails(req, callback) {
    await food.findOne({ "uuid": req.uuid }).exec().then((data) => {
        callback(data);
    });
};

async function updateFood(req, callback) {
    let condition = req._id;
    let update = req.updateObj;
    let option = { new: true };
    console.log(condition);
    await food.findOneAndUpdate(condition, update, option).exec().then((data) => {
        callback(data);
    });
};

async function deleteFood(req, callback) {
    await food.findByIdAndRemove(req).exec().then((data) => {
        callback(data);
    })
};