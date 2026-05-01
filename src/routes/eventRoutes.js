const express = require('express');
const router = express.Router();
const eventController = require('../controllers/eventController');

router.get('/', eventController.getAllEvents);
router.get('/user/:userID', eventController.getEventsForUser);
router.get('/recommended/:userID', eventController.recommendedEvents);
router.get('/event-call-courses/:field', eventController.getCourseColumnsForField);
router.get('/topic/:term', eventController.searchEvents);
router.patch('/:eventID/accept', eventController.acceptEvent);
router.get('/:eventID', eventController.getEventByID);
router.post('/', eventController.requestSpeaker);


module.exports = router;
