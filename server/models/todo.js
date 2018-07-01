const mongoose = require('mongoose');

let Todo = mongoose.model('Todo' /*collection name*/, {
    text: {
        type: String,
        required: true,  /*validators*/ 
        minLenght: 1,
        trime: true
    },
    completed: {
        type: Boolean,
        default: false
    },
    completedAt: {
        type: Number,
        default: null
    }
});

module.exports = {
    Todo
}