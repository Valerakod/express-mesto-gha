const express = require('express');
const mongoose = require('mongoose');

const userRoutes = require('./routes/user');
const cardRoutes = require('./routes/card');

const { PORT = 3000 } = process.env;

const app = express();

// подключаемся к серверу mongo
mongoose.connect('mongodb://127.0.0.1:27017/mestodb').then(() => {
  console.log('Connected to db mongo');
});

app.use((req, res, next) => {
  req.user = {
    _id: '6495edd248081f1ea32ffa53', // вставьте сюда _id созданного в предыдущем пункте пользователя
  };

  next();
});

app.use(userRoutes);
app.use(cardRoutes);
app.all('*', (req, res) => {
  res.status(404).send({ message: 'Route not found' });
});

app.listen(PORT);
