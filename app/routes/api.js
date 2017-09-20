var User     = require('../models/user');
var jwt      = require('jsonwebtoken');
var secret   = 'harrypotter';
module.exports = function(router) {
   
   //User Registratio: http://localhost:8080/api/users
   router.post('/users', function(req,res){
   console.log('Hello Post User:' + req.body.username);
   var user      = new User();
   user.username = req.body.username;
   user.password = req.body.password;
   user.email    = req.body.email;
   user.name     = req.body.name;
   if(req.body.username == null || req.body.username =='' ||
      req.body.password == null || req.body.password =='' ||
      req.body.email    == null || req.body.email    =='' ||
      req.body.name     == null || req.body.name     ==''){
     //res.send("username, pwd, email are required fields");
     res.json({success: false, message:'username, pwd, email, name are required fields'});
   }else{
     user.save(function(err){
       if(err){
        //res.send(err.errors);
        console.log(err.errors);
        if(err.errors.name){
          res.json({success: false, message:err.errors.name.message});
        }else if(err.errors.email){
          res.json({success: false, message:err.errors.email.message});
        }else{
           res.json({success: false, message:err.errors});
        }
       
       }else{
         //res.send("user created:"+ user);
         res.json({success: true, message:'User created! Redirecting to home page ...'});
       }
    });   
   }
});

//User Login: http://localhost:8080/api/authenticate
router.post('/authenticate', function(req, res){
  console.log('Hello Post Authenticate');
  //res.send('Hello Post Authenticate');
  User.findOne({ username:req.body.username})
      .select('email username password')
      .exec(function(err, user){
    if(err) throw err;
    if(!user){
      res.json({success: false, message:'Could not authenticate user'});
    }else {
      var validPwd = false;
      if(req.body.password){
         validPwd = user.comparePassword(req.body.password);
      }else{
        res.json({success: false, message:'No password provided'});
      } 
        
      if(!validPwd){
          res.json({success: false, message:'Could not authenticate password'});
      }else{
          var token = jwt.sign({username : user.username,email : user.email}, 
                                secret, {expiresIn: '24h'});
          res.json({success: true, message:'User Authenticated!', token: token});
      }
    }
  });

});


//checkusername: http://localhost:8080/api/checkusername
router.post('/checkusername', function(req, res){
  console.log('Hello Post checkusername');
  //res.send('Hello Post checkusername');
  User.findOne({ username:req.body.username})
      .select('username')
      .exec(function(err, user){
      if(err) throw err;
      if(user){
        res.json({success: false, message:'User name already exists'});
      }else {
        res.json({success: true, message:'Valid Username'});
      }
    });
});


//checkemail: http://localhost:8080/api/checkemail
router.post('/checkemail', function(req, res){
  console.log('Hello Post checkemail');
  //res.send('Hello Post checkemail');
  User.findOne({ email:req.body.email})
      .select('email')
      .exec(function(err, email){
    if(err) throw err;
      if(email){
       res.json({success: false, message:'Email already exists'});
      }else {
        res.json({success: true, message:'Valid Email'});
      } 
  });
});


router.use(function(req, res, next){
  var token = req.body.token || req.body.query || req.headers['x-access-token'];
   if(token){
    // verify a token symmetric
    jwt.verify(token, secret, function(err, decoded) {
     if(err){
      res.json({success: false, message:'Invalid Token'});
     }else{
       req.decoded = decoded;
       next();
     }
    });

   }else{
     res.json({success: false, message:'No token provided'});
   }
});

//User Login: http://localhost:8080/api/me
router.post('/me', function(req,res){
  console.log('Hello Post me');
   res.send(req.decoded);
});



return router;

}