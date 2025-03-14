const mongoose=require('mongoose');
const addExam=new mongoose.Schema({
    question:{
        type:String,
        require:true
    },
     options: [
        { 
          type: String,
          required: true
        
        }  
    ],
    correctAnswer: { 
        type: String,
         required: true 
        }, 
    explanation: {
         type: String,
          required: true 
        } 
});
const addExamModel=mongoose.model('biologyExam',addExam);
module.exports=addExamModel;