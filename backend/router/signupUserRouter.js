
// signupUser Router.js

const express =require('express');
const router =express.Router();
const signupController =require('../controller/signupUserController');

router.post('/', signupController); // This should match your request
module.exports = router;
