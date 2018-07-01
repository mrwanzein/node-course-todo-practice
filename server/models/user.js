const mongoose = require('mongoose');

let User = mongoose.model('User', {
    user: {
     type: String,
         required: true,
         trim: true,
         minLenght: 1
     }, 
     email: {
         type: String,
         required: true,
         trim: true,
         minLenght: 1
     }
 });

 module.exports = {
    User
}