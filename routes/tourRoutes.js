const express = require('express');
const tourController = require('./../controllers/tourController');
const authController = require('./../controllers/authController');

const router = express.Router();

router
.route('/')
.get(authController.protect,tourController.getAllTour)
.post(tourController.createTour);


router
.route('/:id')
.post(tourController.getOneTour)
.patch(tourController.updateTour)
.delete(tourController.deleteTour);

module.exports = router;