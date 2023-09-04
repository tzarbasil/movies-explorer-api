require('dotenv').config();

const express = require('express');
const mongoose = require('mongoose');

const { errors } = require('celebrate');
const centralErorHanlder = require('./middlewares/centralErorHanlder');
const { requestLogger, errorLogger } = require('./middlewares/logger');

const router = require('./routes/index');

const app = express();
app.use(express.json());
const { PORT = 3000, DB_URL = 'mongodb://127.0.0.1:27017/bitfilmsdb' } = process.env;

app.use(requestLogger);

app.get('/crash-test', () => {
  setTimeout(() => {
    throw new Error('Сервер сейчас упадёт');
  }, 0);
});

mongoose.connect(DB_URL);

app.use(errorLogger);

app.use(errors());
app.use(centralErorHanlder);
app.use(router);

app.use((err, req, res, next) => {
  const { message, statusCode = 500 } = err;
  res.status(statusCode).send({
    message: statusCode === 500 ? 'На сервере произошла ошибка' : message,
  });
  next();
});

app.listen(PORT, () => {
  // eslint-disable-next-line no-console
  console.log(`App listening on port ${PORT}`);
});
