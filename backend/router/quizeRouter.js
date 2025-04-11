const quizController = require('../controller/quizeController');
const express = require('express');
const router = express.Router();
router.post('/', quizController.addQuize);
router.get('/', quizController.getQuize);
module.exports = router;