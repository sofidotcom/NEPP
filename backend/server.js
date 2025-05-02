const express = require("express");
const morgan = require("morgan");
const path = require("path");
const http = require("http");
const cors = require('cors');

require("dotenv").config();
const connectdb = require("./config/db");
const { initializeSocket } = require("./socket/socketManager");

const app = express();
const server = http.createServer(app);

// Initialize Socket.io
const io = initializeSocket(server);

// Middleware
app.use(express.json());
app.use(morgan("dev"));
app.use(cors({
  origin: "http://localhost:3000",
  credentials: true,
}));

// Connect to database
connectdb();

app.use("/uploads", express.static(path.join(__dirname, "Uploads")));
app.use("/uploadedPdf", express.static(path.join(__dirname, "uploadedPdfs")));

const signupStudent = require("./router/signupUserRouter");
app.use("/api/v1/signup/", signupStudent);

const signupTeacher = require("./router/teacherRegisterR");
app.use("/api/v1/teacher/", signupTeacher);

const loginUser = require("./router/loginUserRouter");
app.use("/api/v1/login/", loginUser);

const studentProfileRouter = require("./router/studentProfileR");
app.use("/api/v1/students/", studentProfileRouter);

// Add and display quiz
const quiz = require("./router/quizeRouter");
app.use("/api/v1/quiz", quiz);

// Add entrance exam and display it
const entrance = require("./router/entranceRouter");
app.use("/api/v1", entrance);

// Add shortnote and display it
const noteRoutes = require("./router/noteRouter");
app.use("/api/v1/notes", noteRoutes);

// PDF upload API
const pdfRoutes = require("./router/pdfRouter");
app.use("/api/v1", pdfRoutes);

// Notification API when new PDF uploads
const notification = require("./router/notificationRoute");
app.use("/api/v1/notifications", notification);

// Score
const scoreAdd = require("./router/scoreRouter");
app.use("/api/v1/score", scoreAdd);

// Chat routes
const chatRoutes = require("./router/chatRouter");
app.use("/api/v1/chat", chatRoutes);

const quizScoreRoutes = require("./router/quizScoreRouter");
app.use("/api/v1/quizscore", quizScoreRoutes);

// Leaderboard
const entranceleader = require('./router/leaderboard/entranceleaderRouter');
app.use('/api/v1/leaderboard', entranceleader);

const quizleaderRoutes = require('./router/leaderboard/quizleaderRouter');
app.use('/api/v1/quizleader', quizleaderRoutes);

const progressRoutes = require('./router/leaderboard/quizprogressRouter');
app.use('/api/v1/progress', progressRoutes);

// Profile route
const profileRoute = require('./router/profileRouter');
app.use('/api/v1/profile', profileRoute);

// Recent activity route
const recentActivityRoute = require('./router/recentActivityRouter');
app.use('/api/v1/recent-activities', recentActivityRoute);

// Chart data route
const chartDataRoutes = require("./router/chartDataRouter");
app.use("/api/v1", chartDataRoutes);

// Teacher stats route
const teacherStatsRoutes = require("./router/teacherStatsRouter");
app.use("/api/v1", teacherStatsRoutes);

// Exam analysis route
const examAnalysisRoutes = require("./router/leaderboard/examAnalysisRouter");
app.use("/api/v1/exam-analysis", examAnalysisRoutes);

// Connection
const port = process.env.PORT || 5000;
server.listen(port, () => {
  console.log(`The server running on ${port}`);
});

// const express = require("express");
// const morgan = require("morgan");
// const path = require("path");
// const http = require("http");
// const cors = require('cors');

// require("dotenv").config();
// const connectdb = require("./config/db");
// const { initializeSocket } = require("./socket/socketManager");

// const app = express();
// const server = http.createServer(app);

// // Initialize Socket.io
// const io = initializeSocket(server);

// // Middleware
// app.use(express.json());
// app.use(morgan("dev"));
// app.use(cors({
//   origin: "http://localhost:3000",
//   credentials: true,
// }));

// // Connect to database
// connectdb();

// app.use("/uploads", express.static(path.join(__dirname, "uploads")));
// app.use("/uploadedPdf", express.static(path.join(__dirname, "uploadedPdfs")));

// const signupStudent = require("./router/signupUserRouter");
// app.use("/api/v1/signup/", signupStudent);

// const signupTeacher = require("./router/teacherRegisterR");
// app.use("/api/v1/teacher/", signupTeacher);

// const loginUser = require("./router/loginUserRouter");
// app.use("/api/v1/login/", loginUser);

// const studentProfileRouter = require("./router/studentProfileR");
// app.use("/api/v1/students/", studentProfileRouter);

// // Add and display quiz
// const quiz = require("./router/quizeRouter");
// app.use("/api/v1/quiz", quiz);

// // Add entrance exam and display it
// const entrance = require("./router/entranceRouter");
// app.use("/api/v1", entrance);

// // Add shortnote and display it
// const noteRoutes = require("./router/noteRouter");
// app.use("/api/v1/notes", noteRoutes);

// // PDF upload API
// const pdfRoutes = require("./router/pdfRouter");
// app.use("/api/v1", pdfRoutes);

// // Notification API when new PDF uploads
// const notification = require("./router/notificationRoute");
// app.use("/api/v1/notifications", notification);

// // Score
// const scoreAdd = require("./router/scoreRouter");
// app.use("/api/v1/score", scoreAdd);

// // Chat routes
// const chatRoutes = require("./router/chatRouter");
// app.use("/api/v1/chat", chatRoutes);

// const quizScoreRoutes = require("./router/quizScoreRouter");
// app.use("/api/v1/quizscore", quizScoreRoutes);

// // Leaderboard
// const entranceleader = require('./router/leaderboard/entranceleaderRouter');
// app.use('/api/v1/leaderboard', entranceleader);

// const quizleaderRoutes = require('./router/leaderboard/quizleaderRouter');
// app.use('/api/v1/quizleader', quizleaderRoutes);

// const progressRoutes = require('./router/leaderboard/quizprogressRouter');
// app.use('/api/v1/progress', progressRoutes);

// // Profile route
// const profileRoute = require('./router/profileRouter');
// app.use('/api/v1/profile', profileRoute);

// // Recent activity route
// const recentActivityRoute = require('./router/recentActivityRouter');
// app.use('/api/v1/recent-activity', recentActivityRoute);

// // Chart data route
// const chartDataRoutes = require("./router/chartDataRouter");
// app.use("/api/v1", chartDataRoutes);

// // Connection
// const port = process.env.PORT || 5000;
// server.listen(port, () => {
//   console.log(`The server running on ${port}`);
// });




