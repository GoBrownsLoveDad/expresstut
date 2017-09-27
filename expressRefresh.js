let express    = require("express"),
    handlebars = require("express-handlebars").create({defaultLayout:"main"}),
    formidable = require("formidable"),
    credentials = require("./credentials.js")
    app        = express(),
    port       = 8000;

// blocks header from containing information about server
app.disable("x-powered-by");
app.engine("handlebars", handlebars.engine);
app.set("view engine", "handlebars");
app.use(express.static(__dirname + "/public"));
app.use(require("body-parser").urlencoded({
  extended: true
}));
app.use(require("cookie-parser")(credentials.cookieSecret));

// routes
app.get("/", function(req, res){
  res.render("home");
});

app.get("/about", function(req, res){
  res.render("about");
});

app.get("/contact", function(req, res){
  res.render("contact", {csrf: "CSRF token here "})
});

app.get("/thankyou", function(req, res){
  res.render("thankyou");
});

app.post("/process", function(req, res){
  console.log("Form: " + req.query.form);
  console.log("CSRF Token: " + req.body._csrf);
  console.log("Email: " + req.body.email);
  console.log("Question: " + req.query.ques);
  res.redirect(303, "/thankyou");
});

app.get("/fileUpload", function(req, res){
  let now = new Date();
  res.render("fileUpload", {
    year: now.getFullYear(),
    month: now.getMonth()
  });
});

app.post("/fileUpload/:year/:month", function(req, res){
  let form = new formidable.IncomingForm();
  form.parse(req, function(err, fields, file){
    if(err){
      return res.redirect(303, "/error");
    }
    console.log("received file");
    console.log(file);
    res.redirect(303, "/thankyou");
  })
});

app.get("/cookie", function(req, res){
  res.cookie("username", "Alex Duda", {expire: new Date() + 9999}).send("username has the value of alex");
});

app.get("/listCookies", function(req, res){
  console.log("cookies: " + req.cookies);
  res.send("Look in the console!")
});

app.get("/deleteCookie", function(req, res){
  res.clearCookie("username");
  res.send("username cookie deleted")
})

// example of middleware
app.use(function(req, res, next){
  console.log("Looking for URL: " + req.url);
  next();
});

app.get("/junk", function(req, res, next){
  console.log("Tried to access /junk");
  throw new Error("/junk doesn't exist");
});

app.use(function(err, req, res, next){
  console.log("Error: " + err.message);
  next();
});

app.use(function(req, res){
  res.type('text/html');
  res.status(404);
  res.render('404');
});

app.use(function(err, req, res, next){
  console.error(err.stack);
  res.status(500);
  res.render('500');
});
// end middleware

app.listen(port, function(){
    console.log("Listening on port " + port);
});
