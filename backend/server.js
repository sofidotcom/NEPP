const express = require('express');
const morgan = require('morgan');
const path = require('path');
require('dotenv').config();
const connectdb = require('./config/db'); // Ensure this points to your DB connection logic

const app = express();

// Middleware
app.use(express.json()); // To parse JSON request bodies
app.use(morgan('dev'));

// Connect to database
connectdb();

app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

const signupStudent=require('./router/signupUserRouter');
app.use("/api/v1/signup/",signupStudent);

const signupTeacher=require('./router/teacherRegisterR')
app.use('/api/v1/teacher/',signupTeacher);





const loginUser=require('./router/loginUserRouter');
app.use("/api/v1/login/",loginUser);

const studentProfileRouter = require('./router/studentProfileR');
app.use("/api/v1/students/", studentProfileRouter);

//add and display qiuz  
const quiz= require('./router/quizeRouter');
app.use('/api/v1/bioExam',quiz);
//add entrance exam and display it
const entrance= require('./router/entranceRouter');
app.use('/api/v1',entrance);

//add shortnaot and display  it
const noteRoutes = require('./router/noteRouter');
app.use('/api/v1/notes', noteRoutes);
//score
const scoreAdd=require('./router/scoreRouter');
app.use('/api/v1/score',scoreAdd);


// connection
const port = process.env.PORT || 5000;
app.listen(port, () => {
  console.log(`The server running on  ${port}`);
});

// const addquestion=require('./router/addExamRouter');
// app.use('/api/v1/bioExam',addquestion);

// //display  quiz questions
//   const display=require('./router/displayExam');
//   app.use('/api/v1/bioExam',display);


// const  auth= require('./router/autoRoute');
// app.use('/api/v1/register/',auth)


// const  authh= require('./router/autoRoute');
// app.use('/api/v1/registerteacher/',authh)

// const  authhh= require('./router/autoRoute');
// app.use('/api/v1/loginn/',authhh)

//score add


//

//add entranceexam 
// const biologyEntrance=require('./router/addEntranceRouter');
// app.use('/api/v1/bioEntrance',biologyEntrance);

// // display entrance exam
// const biologyDisplayEntrance=require('./router/entranceDisplayRouter');
// app.use('/api/v1/bioEntrance',biologyDisplayEntrance);



// const pdfRoutes = require('./router/pdfRouter');
// app.use('/api/pdfs', pdfRoutes);

// const videoRoutes = require('./router/videoRouter');
// app.use('/api/videos', videoRoutes);


//

// Start server


