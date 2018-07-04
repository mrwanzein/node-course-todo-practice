const {SHA256} = require('crypto-js');
const jwt = require('jsonwebtoken');

let data = {
    id: 10
}

let token = jwt.sign(data, '123youandme');
console.log(token);

let decoded = jwt.verify(token, '123youandme');
console.log('decoded', decoded);

/* let message = 'I am user number 3';
let hash = SHA256(message).toString();

console.log(`Message: ${message}`);
console.log(`Hash: ${hash}`);

let data = {
    id: 4
}

let token = {
    data,
    hash: SHA256(JSON.stringify(data) + 'somesalt').toString()
}

let resultHash = SHA256(JSON.stringify(token.data) + 'somesalt').toString();

if (resultHash === token.hash) {
    console.log('Data was not changed');
} else {
    console.log('Data was changed. Do not trust!');
} */