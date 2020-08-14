var express=require('express');
var app=express();
app.use(express.static("public"));
app.set("view engine","ejs");
app.set("views","./views");
app.listen(3000,function(){
  console.log("connect thanh cong")
})

var bodyParser = require('body-parser')
// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))

var mongoose=require('mongoose');
mongoose.connect('mongodb+srv://sonvo:251298@cluster0.sql1t.mongodb.net/Book2020?retryWrites=true&w=majority');
var db = mongoose.connection;
//Bắt sự kiện error
db.on('error', function(err) {
  if (err) console.log("Mongo ket noi khong thanh cong : "+err)
});
//Bắt sự kiện open
db.once('open', function() {
  console.log("Ket noi thanh cong!");
});

//Upload
var multer  = require('multer');
var storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, 'public/upload')
    },
    filename: function (req, file, cb) {
      cb(null, Date.now()  + "-" + file.originalname)
    }
});  
var upload = multer({ 
    storage: storage,
    fileFilter: function (req, file, cb) {
        console.log(file);
        if(file.mimetype=="image/bmp"||file.mimetype=="image/png" ||file.mimetype=="image/jpg"||file.mimetype=="image/gif"||file.mimetype=="image/jpeg"){
            cb(null, true)
        }else{
            return cb(new Error('Only image are allowed!'))
        }
    }
}).single("fileImage");

//Models
const Category=require('./Models/Category');
const Book=require('./Models/Book');
const { render } = require('ejs');
//Book
app.get("/page/book",function(req,res){
  Category.find(function(err,items){
    if(err){
      console.log(err);
      res.render("home",{page:"book"})
    }else{
      console.log(items);
      res.render("home",{page:"book",cats:items})
    }

  });
});
app.post("/page/book",function(req,res){
  //Upload
  upload(req, res, function (err) {
    if (err instanceof multer.MulterError) {
      console.log("A Multer error occurred when uploading."); 
    } else if (err) {
      console.log("An unknown error occurred when uploading." + err);
    }else{
        console.log("Upload is okay");
        console.log(req.file); // Thông tin file đã upload
        // if(req.body.txtUn && req.body.txtPa){
        //     // var un = req.body.txtUn;
        //     // var pa = req.body.txtPa;
        //     res.json({"file": req.file.filename});
        // }else{
        //     res.json({"result":0});
        // }
        //save book
        var book =new Book({
          title:req.body.txtbook_title,
          image:req.file.filename,
          file:req.body.txtPdf,
          description:req.body.txtPdfurl,
          ordering:1,
          active:1
        });
       book.save(function(err){
        if(err){
                res.json({kq:0,"err":err});
              }
              else{
                //Add item book -->Category books_id
  Category.findOneAndUpdate({_id:req.body.selectCate},{$push:{books_id:book._id}},function(err){
                  if(err){
                    res.json({kq:0,"err":err});
                  }
                  else{
                    res.redirect("./book")
                  }
                });
              }
       });
    }

});
});
//Category
app.post("/page/category",function(req,res){
  var cates=new Category({
    title:req.body.txtTitle,
    ordering:1,
    active:1,
    books_id:[]
  });
  cates.save(function(err){
    if(err){
      console.log("Save category error"+err);
      res.render("home",{page:"category",message:"Save category error"});
    }else{
      console.log("Save category successfully"+cates._id);
      res.render("home",{page:"category",message:"Save category successfully"});
    }
  });
});
app.get("/page/category",function(req,res){
  Category.find(function(err,items){
    if(err){
      console.log(err);
      res.render("home",{page:"category",categories:[]});
    }
    else{
      console.log(items);
      res.render("home",{page:"category",categories:items});
    }
  });
});

//update category
app.get("/page/category_update/:id",function(req,res){
  Category.findOneAndUpdate({_id:req.params.id},req.body,{new:true},function(err,items){
    if(err){
      console.log(err);
      res.render("home",{page:"category_update",cat:[]});
    }
    else{
      console.log(items);
      res.render("home",{page:"category_update",cat:items});
    }
  });
});



app.get('/',function(req,res){
  res.render("home",{page:"home"});
});

app.get("/page/:p",function(req,res){
    res.render("home",{page: req.params.p});
});



// function listAllCategories(){
//   Category.find(function(err,items){
//     if(err){
//       console.log(err);
//       return null;
//     }
//     else{
//       console.log(items);
//       return items;
//     }
//   });
// };


// app.get("/categories",function(req,res){
//   var cate=new categories({
//     title:'HTML',
//     ordering:1,
//     active:1,
//     books_id:[]
//   });
//   cate.save(function(err){
//     if(err){
//       console.log("Save categories error"+err);
//       res.json({kq:0})
//     }
//     else{
//       console.log("Save categories successfully"+cate._id);
//       res.json({kq:1});
//     }
//   });
// });




// const userSchema =new mongoose.Schema({
//   title:String,
//     ordering:Number,
//     active:Number,
//     books_id:[{type:mongoose.Schema.Types.ObjectId}]
// })
// //tao Model
// const categories =mongoose.model('categories',userSchema);
// categories.create(
//   [
//     {'title':'Agular','active':1},
//     {'title':'HTML/CSS','active':1}
//   ]
// )

