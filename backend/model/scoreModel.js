const mongoose=require('mongoose');
const scoreSchema=new mongoose.Schema({

     student: {
        type: mongoose.Schema.Types.ObjectId, // Reference to the StudentModel
        ref: 'students', // Refers to the 'students' collection
        required: true
    },
    
    year: { 
        type: String,
         required: true
         }, 
    score: { 
        type: Number, 
        required: true
     },     
    totalQuestions: { 
        type: Number,
         required: true
         }, 
    submittedAt: {
         type: Date,
         default: Date.now }
});
const score=mongoose.model('scores',scoreSchema);
module.exports=score;