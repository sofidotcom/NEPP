const addExamModel=require('../model/addExamModel');
exports.addQuize=async(req,res)=>{
    try {
        const newQestion=new addExamModel(req.body);
        const add=await newQestion.save();
        res.status(200).json({message:"successfully added"});
    } catch (error) {
        res.sattus(500).json({message:'faild to add'});
    }
};
exports.getQuize=async(req,res)=>{
    try {
        const display=await addExamModel.find();
        res.status(201).json(display);
    } catch (error) {
       console.log("woo i get error") ;
    }
}