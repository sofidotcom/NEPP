const express =require('express');
const router =express.Router();
const TeacherSignup =require('../controller/teacherRcontroll');

router.post('/', TeacherSignup ); // This should match your request
module.exports = router;
