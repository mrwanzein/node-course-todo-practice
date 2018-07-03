let {ObjectID} = require('mongodb');

let {mongoose} = require('../server/db/mongoose');
let {Todo} = require('../server/models/todo');
let {User} = require('../server/models/user');

/* Todo.findOneAndRemove() */

Todo.findByIdAndRemove('5b3a5cf673631cd00badda62').then((doc) => {
    console.log(doc);
});


