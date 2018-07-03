const _ = require('lodash');
const express = require('express');
const bodyParser = require('body-parser');

let {mongoose} = require('./db/mongoose');
let {Todo} = require('./models/todo');
let {User} = require('./models/user');
let {ObjectID} = require('mongodb');

let app = express();
const port = process.env.PORT || 3000

app.use(bodyParser.json());

app.post('/todos', (req, res) => {
    let todo = new Todo({
        text: req.body.text
    });

    todo.save().then((doc) => {
        res.send(doc);
    }, (err) => {
        res.status(400).send(err);
    })
});

app.get('/todos', (req, res) => {
    Todo.find().then((todos) => {
        res.send({
            todos
        });
    }, (err) => {
        res.status(400).send(err);
    });
});

app.get('/todos/:id', (req, res) => {
    let id = req.params.id;

    if (!ObjectID.isValid(id)) {
     return res.status(404).send();
    }

    Todo.findById(id).then((todo) => {
        if (!todo) {
         return res.status(404).send();
        }

        res.send({todo});
    }).catch((e) => {
        res.status(400).send();
    });

});

app.delete('/todos/:id', (req, res) => {
    let id = req.params.id;

    if (!ObjectID.isValid(id)) {
        return res.status(404).send('Invalid Id');
       }

    Todo.findByIdAndRemove(id).then((doc) => {
        if (!doc) {
            return res.status(404).send('Did not found doc');
        }
        
        res.send(doc);
    }).catch((e) => {
        res.status(400).send();
    });   
});

app.patch('/todos/:id', (req, res) => {
    let id = req.params.id;
    let body = _.pick(req.body, ['text', 'completed']);

    if (!ObjectID.isValid(id)) {
        return res.status(404).send('Invalid Id');
       }

    if (_.isBoolean(body.completed) && body.completed) {
        let hours = new Date().getHours();
        let minutes = new Date().getMinutes();
        body.completedAt = `${hours}:${minutes}`;
    } else {
        body.completed = false;
        body.completedAt = null;
    }

    Todo.findByIdAndUpdate(id, {$set: body}, {new: true}).then((doc) => {
        if (!doc) {
            return res.status(404).send('Can\'t find id');
        }

        res.send({todo: doc});
    }).catch((e) => {
        res.status(400).send();
    });   
});

app.listen(port, () => {
    console.log(`Server started on port ${port}`);
});


