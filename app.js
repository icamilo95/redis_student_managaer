var express = require("express"),
app = express(),
redis = require("redis"),
client = redis.createClient(),
bodyParser =  require("body-parser"),
methodOverride = require("method-override");

// need me some middleware!
 app.set("view engine", "ejs");
 app.use(bodyParser.urlencoded({extended: true}));
 app.use(methodOverride('_method'));
// If I want to include css/js/imgs
 app.use(express.static(__dirname + '/public'));
// Routes

//Index
app.get ("/", function(req,res){
   client.hgetall("students", function(err,students){
      // console.log(students);
      res.render("index",{students: students});
   });
});

var student_Id = 0;
// Post to create a student
app.post('/create', function(req,res){
   client.hset("students",student_Id++,req.body.stuname);
   res.redirect("/");
});


// Post to edit a student
app.post('/edit/:key', function(req,res){
   var key = req.params.key;
   client.hget("students",req.params.key, function(req,student){
      res.render("edit",{student: student, key: key});
   });
});

// Post to update a student
app.post('/update/:key', function(req,res){
   var key = req.params.key;
   var newname = req.body.stuname;
   client.hget("students",req.params.key, function(req,student){
      client.hset("students",key,newname);
       res.redirect("/");      
   });
});

// Delete student
app.delete('/remove/:key', function(req,res){
   // console.log(req.params.key);
   client.hdel("students",req.params.key);
   res.redirect("/");      
});

//Start the server
 app.listen(3000, function(){
   console.log("Server starting on port 3000");
 });