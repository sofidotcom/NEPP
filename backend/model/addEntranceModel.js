const mongoose = require('mongoose');

const EntranceSchema = new mongoose.Schema({
  question: {
    text: { type: String, required: false },
    image: { type: String, required: false },
  },
  options: [
    {
      text: { type: String, required: false },
      image: { type: String, required: false },
    }
  ],
  correctAnswer: {
    type: String,
    required: true
  },
  year: {
    type: String,
    required: true
  },
  subject: {
    type: String,
    required: true
  },

    createdBy: {        
    type: String,        
    required: true
  },


},{ timestamps: true });

const EntranceModel = mongoose.model('biologyentrances', EntranceSchema);
module.exports = EntranceModel;
