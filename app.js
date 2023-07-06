const { constants } = require('node:http2');
const express = require('express');
const mongoose = require('mongoose');

const userRoutes = require('./routes/user');
const cardRoutes = require('./routes/card');
const { login, createUser } = require('./controllers/user');

const { PORT = 3000 } = process.env;

const app = express();

// подключаемся к серверу mongo
mongoose.connect('mongodb://127.0.0.1:27017/mestodb').then(() => {
  console.log('Connected to db mongo');
});

app.use(userRoutes);
app.use(cardRoutes);
app.all('*', (req, res) => {
  res
    .status(constants.HTTP_STATUS_NOT_FOUND)
    .send({ message: 'Route not found' });
});

app.post('/signin', login);
app.post('/signup', createUser);
app.listen(PORT);
