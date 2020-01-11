const express = require('express');
const tourController = require('./../controllers/tourController');


const router = express.Router();

router
.route('/')
.get(tourController.getAllTour)
.post(tourController.createTour);


router
.route('/:id')
.post(tourController.getOneTour)
.patch(tourController.updateTour)
.delete(tourController.deleteTour);

module.exports = router;