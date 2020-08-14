const mongoose=require('mongoose');
const bookSchema=new mongoose.Schema({
    title:String,
    image:String,
    file:String,
    description:String,
    ordering:Number,
    active:Number
});

module.exports=mongoose.model('Book',bookSchema);