var express = require('express'); 
var bodyParser = require('body-parser'); 
var multer = require('multer'); 
var alert = require('alert-node');
var app = express();

app.set('view engine', 'pug');
app.set('views', './views');


var mongoose = require("mongoose");
mongoose.connect('mongodb://localhost/my_db');

var UserSchema = mongoose.Schema({ fname: String, lname: String,uname: String, type:String, password: String}); 
var User = mongoose.model("User", UserSchema);

var product = mongoose.Schema({ Name: String, Description: String, Price: Number, category: String});
var product = mongoose.model("product",product);


app.use(express.static('public')); 
app.get('/', function(req, res){ 
res.sendfile('html/SignUp.html');
}); 

app.use(bodyParser.json()); 
app.use(bodyParser.urlencoded({ extended: true })); 

app.post('/submit', function (req, res) {
    if (!req.body.fname || !req.body.lname || !req.body.uname || !req.body.password || !req.body.password1 || !req.body.type) {
        alert("No field should be empty");
    }
    User.findOne({ uname: req.body.uname }, function (err, response) {
        if (response != null) {
            alert(req.body.uname + " already exist! Try Another Name.");
        }
        else {
            if (req.body.password !== req.body.password1)
                alert("Password Does not match!");

            else {
                var newPerson = new User({ fname: req.body.fname, lname: req.body.lname, uname: req.body.uname, type: req.body.type, password: req.body.password });
                newPerson.save(function (err, User) {
                    if (err)
                        res.send("Database error");
                });
		console.log(req.body.type);
                if (req.body.type == "Buyer"){
                    product.find({}, function (err, result) {
                        console.log(result);
                        res.render("product1.pug", {
                            documents: result
                        });
                    });
                }

                if (req.body.type == "Seller") {
                    product.find({}, function (err, result) {
                        console.log(result);
                        res.render("product.pug", {
                            documents: result
                        });
                    });
                }

                app.post('/new', function (req, res) {
                    res.sendfile("html/NewProduct.html");
                });

            }
        }
    });
});

        
    
    

    
app.post('/add', function (req, res){
    if (!req.body.pname || !req.body.Description || !req.body.price || !req.body.category ) {
        alert("No field should be empty");
    }
    else {
        var newproduct = new product({ Name: req.body.pname, Description: req.body.Description, Price: req.body.price, category: req.body.category });
        newproduct.save(function (err) {
            if (err) res.send("Database error");
            else {


            product.find({}, function (err, result) {
                    console.log(result);
                    res.render("product.pug", {
                        documents: result
                    });
                });
            }
        });
    }
    
});


app.post('/login', function (req, res) {
    if (!req.body.uname1 || !req.body.password2) {
        app.alert("No field should be empty");
    }
    else {
        User.findOne({ uname: req.body.uname1, password: req.body.password2, type: 'Buyer' }, function (err, response) {
            if (response == null) {
                User.findOne({ uname: req.body.uname1, password: req.body.password2, type: 'Seller' }, function (err, response) {
                    if (response == null)
                        alert("User Name or password Incorrect! Don't have an account? Sign Up");
                    else {
                        product.find({}, function (err, result) {
                            console.log(result);
                            res.render("product.pug", {
                                documents: result
                            });
                        });
                    }
                });
            }

            else {
                product.find({}, function (err, result) {
                    console.log(result);
                    res.render("product1.pug", {
                        documents: result
                    });

                });
            }

 app.post('/new', function (req, res) {
    res.sendfile("html/NewProduct.html");
                app.post('/add', function (req, res) {
                    if (!req.body.pname || !req.body.Description || !req.body.price || !req.body.category || !req.body.pimage) {
                        app.alert("No field should be empty");
                    }
                    else {
                        var newproduct = new product({ Name: req.body.pname, Description: req.body.Description, Price: req.body.price, category: req.body.category });
                        newproduct.save(function (err, User) {
                            if (err) res.send("Database error");
                            else {
                                product.find({}, function (err, result) {
                                    console.log(result);
                                    res.render("product1.pug", {
                                        documents: result
                                    });

                                });
                            }
                               
                        });
                    }
                });

            });
        });
    }
});

app.post("/update", function (req, res) {
    res.sendfile("html/UpdateProduct.html");
});

app.post("/updated", function (req, res) {
    const name = req.body.pname;
    const price = req.body.price;
    const category = req.body.category;
    const description = req.body.Description;

    product.findOneAndUpdate({ Name: name, category: category}, { Price: price, Description:description });

    product.find({}, function (err, result) {
        console.log(result);
         res.render("product.pug", {
          documents: result
         });
    });

});



app.post('/delete', function (req, res) {
    res.sendfile("html/DeleteProduct.html");
});
app.post("/deleted", function (req, res) {
const name = req.body.pname;
const price = req.body.price;
console.log('Delete post');
product.findOneAndRemove({ Name: name});

console.log('Delete find');
product.find({},
     function (err, result) {
         if (!err) {
             res.render('product.pug', {
                 documents:result 
             });
         }
         else { throw err; }
     }
   );
});

app.post("/logout", function (req, res) {
    res.sendfile("html/SignUp.html");
});
app.listen(3000);