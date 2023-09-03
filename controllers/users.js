const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/user');

const NotFoundError = require('../errors/NotFoundError');
const BadRequestError = require('../errors/badRequestError');
const ConflictingError = require('../errors/conflitingError');

module.exports.login = (req, res, next) => {
  const { email, password } = req.body;

  return User.findUserByCredentials(email, password)
    .then((user) => {
      res.send({
        token: jwt.sign({ _id: user._id }, (process.env && process.env.NODE_ENV === 'production' ? process.env.JWT_SECRET : 'dev-secret'), { expiresIn: '7d' }),
      });
    })
    .catch((err) => next(err));
};

module.exports.getCurrentUser = (req, res, next) => {
  const { _id } = req.user;
  User.findById(_id)
    .orFail(new NotFoundError('Пользователь отсутствует'))
    .then((user) => {
      res.send({ data: user });
    })
    .catch((err) => {
      next(err);
    });
};

module.exports.createUser = (req, res, next) => {
  const { email, password, name } = req.body;

  bcrypt
    .hash(password, 10)
    .then((hash) => User.create({
      email, password: hash, name,
    }))
    .then((user) => {
      console.log(user);
      res.status(200).send({ email: user.email, _id: user._id, name: user.name });
    })
    .catch((err) => {
      console.log(err);
      if (err.name === 'ValidationError') {
        next(
          new BadRequestError(
            'Переданы некорректные данные',
          ),
        );
      } else if (err.code === 11000) {
        next(
          new ConflictingError('Пользователь с таким email уже существует'),
        );
      } else {
        next(err);
      }
    });
};

module.exports.updateUser = (req, res, next) => {
  const { name, email } = req.body;
  User.findByIdAndUpdate(req.user._id, { name, email }, { new: true, runValidators: true })
    .then((user) => res.status(200).send(user))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        next(
          new BadRequestError(
            'Переданы некорректные данные',
          ),
        );
      } else {
        next(err);
      }
    });
};
