const express = require('express');
const jwt = require('jwt-simple');

const SECRET = process.env.SECRET || 'foobar'; // 'foobar' is for development environment

// SUMMARY:
// two routes: one generates a token. don't store any real secret data in the token.
// main purpose of generating the token is to identify the user.
// to make sure the token is not manipulated, there's the idea of a payload and an encrypted version of that payload. that's done with a SECRET key. that's use some env variable other than 'foobar' in production environment.

const app = express();

const users = [
  {
    id: 1,
    username: 'Moe',
    password: 'moe',
    favorite: 'foo'
  },
  {
    id: 2,
    username: 'Larry',
    password: 'larry',
    favorite: 'bar'
  }
];

app.use(require('cors')()); // will allow any kind of origin to do cross origin req
app.use(require('body-parser').json());

// go in with credentials, which generate a token. can store this on the client side in local storage. so if there's a hard reload on a single page app, you can use that token to go an log in that user.
app.post('/api/tokens', (req, res, next) => {
  const credentials = req.body;
  const { username, password } = credentials;
  const user = users.find(user => user.username === username && user.password === password); // because it's an array and not on Sequelize
  if (user) return res.send({ token: jwt.encode({ id: user.id }, SECRET) }); // this means, jwt I want you to encode this id and secret
  return res.sendStatus(401);
});

app.get('/api/me', (req, res, next) => {
  // headers are just key-value pairs (accessed here via req.headers)
  // assuming that token comes in the form of an header:
  const token = req.headers.auth; // sets the headers
  // grab the auth header

  // it will give a 500 error if token's invalid and if you don't do try/catch
  try {
    const id = jwt.decode(token, SECRET).id; // decoding instead of encoding
    // being optimistic that it will return the user id
    const user = users.find(user => user.id === id);
    res.send(user); // being optimistic that we'll find the user
  }
  catch(ex) {
    res.sendStatus(401);
  }
});

module.exports = app;
