const scoreModel=require('../model/scoreModel');
const scoreController=async(req,res)=>{
   try {
    const newScore=new scoreModel(req.body);
        await newScore.save();
        res.status(200).json({message:"succcessfully added"})
   } catch (error) {
        res.status(200).json({message:"not succcessfully added"})
   }    
}
module.exports=scoreController;