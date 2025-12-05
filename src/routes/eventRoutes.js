const express = require('express');
const router = express.Router();
const eventController = require('../controllers/eventController');

router.get('/', eventController.getAllEvents);
router.get('/event-call-courses/:field', eventController.getCourseColumnsForField);
router.post('/request-speaker', eventController.requestSpeaker);
router.post('/', eventController.requestSpeaker);
router.get('/recommendedEvents/:userID', eventController.recommendedEvents);

module.exports = router;
