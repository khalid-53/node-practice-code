const express = require("express");
// const tourController = require('./../controllers/tourController');
// const authController = require('./../controllers/authController');
const tourController = require("../controllers/tourController");
const authController = require("../controllers/newAuthController");
const router = express.Router();

// router.param('id', tourController.checkID);

router.post("/addTour", tourController.createTour);
router.get(
  "/get-all-tours",
  authController.protect,
  tourController.getAllTours
);
router.get("/get-tour/:id", tourController.getTour);

// router
//   .route('/top-5-cheap')
//   .get(tourController.aliasTopTours, tourController.getAllTours);

// router.route('/tour-stats').get(tourController.getTourStats);
// router.route('/monthly-plan/:year').get(tourController.getMonthlyPlan);

// router
//   .route('/')
//   .get(authController.protect, tourController.getAllTours)
//   .post(tourController.createTour);

// router
//   .route('/:id')
//   .get(tourController.getTour)
//   .patch(tourController.updateTour)
//   .delete(
//     authController.protect,
//     authController.restrictTo('admin', 'lead-guide'),
//     tourController.deleteTour
//   );

module.exports = router;
