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
        type: String,
        default: null
    },
    _creator: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
    }
});

module.exports = {
    Todo
}