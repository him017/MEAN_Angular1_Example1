var mongoose = require('mongoose');
var Schema   = mongoose.Schema;
var bcrypt   = require('bcrypt-nodejs');
var titlize  = require('mongoose-title-case');
var validate = require('mongoose-validator');

var nameValidator = [
  validate({
    validator: 'matches',
    arguments: /^[a-zA-Z\-]+$/,
    message : 'Only characters allowed'
  })
];

var emailValidator = [
  validate({
    validator: 'isEmail',
    message : 'Is not valid email'
  }),
  validate({
    validator: 'isLength',
    arguments: [3, 25],
    message: 'Email should be between {ARGS[0]} and {ARGS[1]} characters'
  })
];

var UserSchema = new Schema({
   name  :{type: String, required: true, validate:nameValidator},
   username :{type: String, required: true, lowercase: true,  unique:true},
   password :{type: String, required: true},
   email    :{type: String, required: true, lowercase:true, unique:true, validate:emailValidator}
});

UserSchema.pre('save', function(next) {
  var user = this;
  bcrypt.hash(user.password, null, null, function(err, hash) {
    if(err) return next(err);
    user.password = hash;
    next();
  });
});

// Attach some mongoose hooks 
UserSchema.plugin(titlize, {
  paths: [ 'name' ],
  trim: true
});

UserSchema.methods.comparePassword = function(password){
  return bcrypt.compareSync(password, this.password);
}


module.exports = mongoose.model('User', UserSchema);