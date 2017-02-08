var express = require("express");
var app = express();

app.use("/rockets", express.static(process.cwd()+'/rockets'));
app.use("/pathfinder", express.static(process.cwd()+'/pathfinder'));

app.get('/rockets',function(req,res){
  res.sendFile(process.cwd()+'/rockets/html');
});
app.get('/pathfinder',function(req,res){
  res.sendFile(process.cwd()+'/pathfinder/html');
});

var port = process.env.PORT || 8080;
app.listen(port);
