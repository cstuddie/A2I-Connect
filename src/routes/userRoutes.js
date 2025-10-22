const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');

router.get('/profiles', userController.getAllProfiles);
router.get('/trueInterests/:userID', userController.getTrueInterests);
router.get('/interests/:userID', userController.getInterestsByUser);
router.get('/allInterests', userController.getAllInterests);
router.get('/courses/:userID', userController.getCoursesByUser);

module.exports = router;
