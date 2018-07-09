const _ = require('lodash');
const express = require('express');
const bodyParser = require('body-parser');

let {mongoose} = require('./db/mongoose');
let {Todo} = require('./models/todo');
let {User} = require('./models/user');
let {ObjectID} = require('mongodb');
let {authenticate} = require('../server/middleware/authenticate');

let app = express();
const port = process.env.PORT || 3000

app.use(bodyParser.json());

app.post('/todos', authenticate, (req, res) => {
    let todo = new Todo({
        text: req.body.text,
        _creator: req.user._id
    });

    todo.save().then((doc) => {
        res.send(doc);
    }, (err) => {
        res.status(400).send(err);
    })
});

app.get('/todos', authenticate, (req, res) => {
    Todo.find({
        _creator: req.user._id
    }).then((todos) => {
        res.send({
            todos
        });
    }, (err) => {
        res.status(400).send(err);
    });
});

app.post('/users', (req, res) => {
    let body = _.pick(req.body, ['email', 'password']); // choose what data the user can temper with
    let user = new User(body);

    user.save().then(() => {
       return user.generateAuthToken();
    }).then((token) => {
        res.header('x-auth', token).send(user);
    }).catch((e) => {
        res.status(400).send(e);
    });
});

app.get('/users/me', authenticate, (req, res) => {
    res.send(req.user);
});

app.post('/users/login', (req, res) => {
    let body = _.pick(req.body, ['email', 'password']);

    User.findByCredentials(body.email, body.password).then((user) => {
       return user.generateAuthToken().then((token) => {
        res.header('x-auth', token).send(user);
        });
    }).catch((e) => {
        res.status(400).send();
    }); 
});

app.delete('/users/me/token', authenticate, (req, res) => {
    req.user.removeToken(req.token).then(() => {
        res.status(200).send();
    }, () => {
        res.status(400).send();
    })
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


