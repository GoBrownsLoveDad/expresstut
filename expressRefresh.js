let express = require("express"),
    app     = express(),
    port    = 8000;

app.get("/", function(req, res){
  res.send("express works");
});

app.listen(port, function(){
    console.log("Listening on port " + port);
});
