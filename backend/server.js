// const express = require('express');
// const morgan = require('morgan');
// const path = require('path');
// require('dotenv').config();
// const connectdb =require('./config/db'); // Ensure this points to your DB connection logic

// const app = express();

// // Middleware
// app.use(express.json()); // To parse JSON request bodies
// app.use(morgan('dev'));

// // Connect to database
// connectdb();

// app.use("/uploads", express.static(path.join(__dirname, "uploads")))// this is for image  from the added exam entrance
// app.use('/uploadedPdf', express.static(path.join(__dirname, 'uploadedPdfs')));// this is for the uploaded pdf folder 



// const signupStudent=require('./router/signupUserRouter');
// app.use("/api/v1/signup/",signupStudent);

// const signupTeacher=require('./router/teacherRegisterR')
// app.use('/api/v1/teacher/',signupTeacher);





// const loginUser=require('./router/loginUserRouter');
// app.use("/api/v1/login/",loginUser);

// const studentProfileRouter = require('./router/studentProfileR');
// app.use("/api/v1/students/", studentProfileRouter);

// //add and display qiuz  
// const quiz= require('./router/quizeRouter');
// app.use('/api/v1/bioExam',quiz);


// //add entrance exam and display it
// const entrance= require('./router/entranceRouter');
// app.use('/api/v1',entrance);

// //add shortnaot and display  it
// const noteRoutes = require('./router/noteRouter');
// app.use('/api/v1/notes', noteRoutes);

// //  this is the pdf added api
// const pdfRoutes = require('./router/pdfRouter');
// app.use('/api/v1', pdfRoutes);


// // this is the notificathion api when new pdf uploads
// const notification=require('./router/notificationRoute');
// app.use('/api/v1/notifications',notification);




// //score
// const scoreAdd=require('./router/scoreRouter');
// app.use('/api/v1/score',scoreAdd);


// // connection
// const port = process.env.PORT || 5000;
// app.listen(port, () => {
//   console.log(`The server running on  ${port}`);
// });




const express = require("express")
const morgan = require("morgan")
const path = require("path")
const http = require("http")
require("dotenv").config()
const connectdb = require("./config/db")
const { initializeSocket } = require("./socket/socketManager")

const app = express()
const server = http.createServer(app)

// Initialize Socket.io
const io = initializeSocket(server)

// Middleware
app.use(express.json())
app.use(morgan("dev"))

// Connect to database
connectdb()

app.use("/uploads", express.static(path.join(__dirname, "uploads")))
app.use("/uploadedPdf", express.static(path.join(__dirname, "uploadedPdfs")))

const signupStudent = require("./router/signupUserRouter")
app.use("/api/v1/signup/", signupStudent)

const signupTeacher = require("./router/teacherRegisterR")
app.use("/api/v1/teacher/", signupTeacher)

const loginUser = require("./router/loginUserRouter")
app.use("/api/v1/login/", loginUser)

const studentProfileRouter = require("./router/studentProfileR")
app.use("/api/v1/students/", studentProfileRouter)

//add and display quiz
const quiz = require("./router/quizeRouter")
app.use("/api/v1/bioExam", quiz)

//add entrance exam and display it
const entrance = require("./router/entranceRouter")
app.use("/api/v1", entrance)

//add shortnote and display it
const noteRoutes = require("./router/noteRouter")
app.use("/api/v1/notes", noteRoutes)

//this is the pdf added api
const pdfRoutes = require("./router/pdfRouter")
app.use("/api/v1", pdfRoutes)

//this is the notification api when new pdf uploads
const notification = require("./router/notificationRoute")
app.use("/api/v1/notifications", notification)

//score
const scoreAdd = require("./router/scoreRouter")
app.use("/api/v1/score", scoreAdd)

// Chat routes
const chatRoutes = require("./router/chatRouter")
app.use("/api/v1/chat", chatRoutes)

// connection
const port = process.env.PORT || 5000
server.listen(port, () => {
  console.log(`The server running on ${port}`)
})

