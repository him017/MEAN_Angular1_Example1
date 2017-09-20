var express      = require('express');
var bodyParser   = require('body-parser');
var app          = express();
var port         = process.env.PORT || 8080;
var morgan       = require('morgan');
var mongoose     = require('mongoose');
const mongodburl = 'mongodb://localhost:27017/tutorial'
var router       = express.Router();
var appRoutes    = require('./app/routes/api')(router);
var path         = require('path');
var passport     = require('passport');
var social       = require('./app/passport/passport')(app, passport);

//Following order is important
app.use(morgan('dev')); //Logs the requests
app.use(bodyParser.json()); // for parsing application/json
app.use(bodyParser.urlencoded({ extended: true })); // for parsing application/x-www-form-urlencoded
app.use(express.static(__dirname + '/public')); //access to front end files

//Backend routes url looks like http://localhost:8080/api/
app.use('/api', appRoutes);//Use routes 


mongoose.connect(mongodburl, {useMongoClient: true}, function(err){
    if(err){
      console.log('Unable to connect to DB:' +err);
    }else{
      console.log('Successfully to connect to DB:');
    }
});

/*
app.get('/home', function(req, res){
    res.send("Hello Home");
})

app.get('/', function(req,res){
   res.send('Hello');
});
*/

app.get('*', function(req,res){
     res.sendFile(path.join(__dirname + '/public/app/views/index.html'));
})

app.listen(port, function(){
    console.log('Server Running on port:'+port);
});