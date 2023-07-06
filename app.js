const express = require('express');
const mongoose = require('mongoose');
const NotFoundError = require('./errors/NotFoundError');

const userRoutes = require('./routes/user');
const cardRoutes = require('./routes/card');
const { login, createNewUser } = require('./controllers/user');

const { PORT = 3000 } = process.env;

const app = express();

// подключаемся к серверу mongo
mongoose.connect('mongodb://127.0.0.1:27017/mestodb').then(() => {
  console.log('Connected to db mongo');
});

app.use(userRoutes);
app.use(cardRoutes);
app.all('*', (req, res, next) => {
  next(new NotFoundError('Route not found'));
});

app.post('/signin', login);
app.post('/signup', createNewUser);
app.listen(PORT);
