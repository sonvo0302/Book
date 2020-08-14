const mongoose=require('mongoose');
const categoriesSchema=new mongoose.Schema({
    title:String,
    ordering:Number,
    active:Number,
    books_id:[{type:mongoose.Schema.Types.ObjectId}]
});

module.exports=mongoose.model('Category',categoriesSchema);