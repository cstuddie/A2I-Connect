const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');

router.get('/expertise', userController.getExpertise);
router.get('/', userController.getAllProfiles);
router.get('/trueInterests/:userID', userController.getTrueInterests);
router.get('/interests/:userID', userController.getInterestsByUser);
router.get('/allInterests', userController.getAllInterests);
router.get('/courses/:userID', userController.getCoursesByUser);
router.get('/:id', userController.getProfileByID);

module.exports = router;
