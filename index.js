const app = require('express')();
const mongoose = require('mongoose');
const requireDir = require('require-dir');
const bodyParser = require('body-parser');

const dbConfig = require('./config/database');

mongoose.connect(
  dbConfig.url,
  { useNewUrlParser: true },
);
requireDir(dbConfig.modelsPath);

app.use(bodyParser.json());

app.post('/create', async (req, res) => {
  const User = mongoose.model('User');

  console.log(req.body);
  await User.create(req.body);

  return res.send();
});

app.listen(3000);
