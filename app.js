// eslint-disable-next-line import/no-extraneous-dependencies
require('dotenv').config();

const express = require('express');

const mongoose = require('mongoose');

const { errors } = require('celebrate');
// eslint-disable-next-line import/no-unresolved
// const helmet = require('helmet');

const app = express();
app.use(express.json());
const { PORT = 3000, DB_URL = 'mongodb://127.0.0.1:27017/bitfilmsdb' } = process.env;

// eslint-disable-next-line import/no-unresolved, import/extensions
const usersRouter = require('./routes/users');

const moviesRouter = require('./routes/movies');

const celebrate = require('./middlewares/celebrate');

const { login, createUser } = require('./controllers/users');

const { requestLogger, errorLogger } = require('./middlewares/logger');

app.use(requestLogger);

// const { cors } = require('./middlewares/cors');

const NotFoundError = require('./errors/NotFoundError');

// app.use(cors);
// app.get('/crash-test', () => {
//   setTimeout(() => {
//     throw new Error('Сервер сейчас упадёт');
//   }, 0);
// });
app.post('/signin', celebrate.validateLoginUser, login);
app.post('/signup', celebrate.validateCreateUser, createUser);
app.use('/users/', usersRouter);
app.use('/movies/', moviesRouter);

mongoose.connect(DB_URL);

app.use((req, res, next) => {
  next(new NotFoundError('Запрос на несуществующий адрес'));
});

app.use(errorLogger);

app.use(errors());

app.use((err, req, res, next) => {
  const { message, statusCode = 500 } = err;
  console.log(message);
  res.status(statusCode).send({
    message: statusCode === 500 ? 'На сервере произошла ошибка' : message,
  });
  next();
});

// app.use(helmet());

app.listen(PORT, () => {
  // eslint-disable-next-line no-console
  console.log(`App listening on port ${PORT}`);
});
