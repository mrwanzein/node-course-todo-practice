const mongoose = require('mongoose');
const validator = require('validator');
const jwt = require('jsonwebtoken');
const _ = require('lodash');
const bcrypt = require('bcryptjs');

let UserSchema = new mongoose.Schema({
        email: {
            type: String,
            required: true,
            trim: true,
            minLenght: 1,
            unique: true, // when using this validator, make sure to restart the appropriate database
            validate: {
                validator: validator.isEmail,
                message: '{VALUE} is not a valid email'
            }
           },
            password: {
                type: String,
                required: true,
                minLenght: 6
            },
            tokens: [{
                access: {
                    type: String,
                    required: true
                },
                token: {
                   type: String,
                   required: true
                }
            }]     
   
});

UserSchema.methods.toJSON = function() {
  let user = this;
  let userObject = user.toObject();

  return _.pick(userObject, ['_id', 'email']); // what the user can see
  
};

UserSchema.methods.generateAuthToken = function() {
    let user = this; // does not work in arrow function
    let access = 'auth';
    let token = jwt.sign({_id: user._id.toHexString(), access}, 'youandme').toString();

    user.tokens = user.tokens.concat([{access, token}]);

    return user.save().then(() => {
        return token;
    });
};

UserSchema.methods.removeToken = function(token) {
    let user = this;

  return user.update({
        $pull: {
            tokens: {token}
        }
    });
};

UserSchema.statics.findByToken = function(token) {
    let User = this;
    let decoded;

    try {
        decoded = jwt.verify(token, 'youandme');
    } catch(e) {
        return Promise.reject();
    }

   return User.findOne({
    '_id': decoded._id,
    'tokens.token': token,
    'tokens.access': 'auth'
   });
};

UserSchema.statics.findByCredentials = function(email, password) {
    let User = this;

  return  User.findOne({email}).then((user) => {
      if (!user) {
        return Promise.reject();
      }

      return new Promise((resolve, reject) => {
          bcrypt.compare(password, user.password, (err, res) => {
            if (res) {
                resolve(user);
            } else {
                reject();
            }
          });
      });
  });
};

UserSchema.pre('save', function(next) {
    let user = this;

    if (user.isModified('password')) {
      bcrypt.genSalt(10, (err, salt) => {
        bcrypt.hash(user.password, salt, (err, hash) => {
            user.password = hash;
            next();
            });
        });
    } else {
        next();
    }
});

let User = mongoose.model('User', UserSchema);

 module.exports = {
    User
}