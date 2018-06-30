
// connecting to mongodb protocol
/* details in these comment form are for mongodb module v3 */ 

/* const MongoClient = require('mongodb').MongoClient; */
const {MongoClient, ObjectID} = require('mongodb');

MongoClient.connect('mongodb://localhost:27017/TodoApp', (err, db /* db get replaced by client */) => {
 if (err) {
  return console.log('Unable to connect to mongdb server');
 }

 console.log('Connected to MongoDB server');
 /* because db got replaced so we use: const db = client.db(<collection>) */ 

db.collection('Todos').findOneAndUpdate({
    _id: new ObjectID("5b37af07d5f999d29c1758ad")
}, {
    $set: { // update operator
        completed: true
    } 
}, {
    returnOriginal: false
}).then((res) => {
    console.log(res);
});

 db.close(); 
 /* client.close() */
});