const express = require("express");
const router = express.Router();
const foodService = require("./food.service.js");
const auth = require("../helper/middleware/auth.js")

router.post('/addFoodDetails', auth, addFoodDetails);
router.get('/getFoodDetails', getFoodDetails);
router.get('/getOneFoodDetails', auth, getOneFoodDetails);
router.put('/updateFood', auth, updateFood);
router.delete('/deleteFood', auth, deleteFood);

module.exports = router;

function addFoodDetails(req, res, next) {
    foodService.addFoodDetails(req.body, function(result) {
        res.json({ "status": "Success", "message": "food successfully added", "data": result })
    })
};

function getFoodDetails(req, res, next) {
    foodService.getFoodDetails(req.body, function(result) {
        res.json({ "status": "successfully Get The Data", "Data": result })
    })
};

function getOneFoodDetails(req, res, next) {
    foodService.getOneFoodDetails(req.query, function(result) {
        res.json({ "status": "successfully Get The Data", "Data": result })
    })
};

function updateFood(req, res, next) {
    foodService.updateFood(req.body, function(result) {
        res.json({ "status": "food Updated Successfully", "Data": result })
    })
};

function deleteFood(req, res, next) {
    foodService.deleteFood(req.query, function(result) {
        res.json({ "status": "food Deleted Successfully" })
    })
};