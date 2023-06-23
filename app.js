const express = require('express');
const mongoose = require('mongoose');

const userRoutes = require('./routes/user');

const { PORT = 3000 } = process.env;

const app = express();

// подключаемся к серверу mongo
mongoose.connect('mongodb://127.0.0.1:27017/mestodb').then(() => {
  console.log('Connected to db mongo');
});

app.use((req, res, next) => {
  req.user = {
    _id: '5d8b8592978f8bd833ca8133' // вставьте сюда _id созданного в предыдущем пункте пользователя
  };

  next();
});

app.use(userRoutes);
// подключаем мидлвары, роуты и всё остальное...

app.listen(PORT);
