const {mongoose} = require('../server/db/mongoose');
const {Todo} = require('../server/models/todo');

let id = '5b38f399bcb1c70807f762ce';

/* Todo.find({
    _id: id
}).then((todos) => {
    console.log('Todos', todos); // returns array of multiple docs
});

Todo.findOne({
    _id: id
}).then((todo) => {
    console.log('Todos', todo); // returns a single doc
}) */


Todo.findById(id).then((todo) => {
    if (!todo) {
        return console.log('Id not found');
    }

    console.log('Todo by Id', todo);
})