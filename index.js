const app = require('express')();
const mongoose = require('mongoose');
const requireDir = require('require-dir');

const dbConfig = require('./config/database');

mongoose.connect(
  dbConfig.url,
  { useNewUrlParser: true },
);
requireDir(dbConfig.modelsPath);

const User = mongoose.model('User');
User.create(
  {
    name: 'Maiko',
    username: 'maiko',
    email: 'maikossmaster@gmail.com',
    password: '123',
  },
  () => {
    console.log('OK');
  },
);

app.listen(3000);
