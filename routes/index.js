const router = require('express').Router();
const users = require('./users');
const movies = require('./movies');

const { auth } = require('../middlewares/auth');

const NotFoundError = require('../errors/NotFoundError');

const { createUser, login } = require('../controllers/users');
const { validateCreateUser, validateLoginUser } = require('../middlewares/celebrate');

router.post('/signup', validateCreateUser, createUser);
router.post('/signin', validateLoginUser, login);

router.use('/users', auth, users);
router.use('/movies', auth, movies);

router.use('*', auth, (req, res, next) => {
  next(new NotFoundError('Ресурс не найден. Проверьте URL и метод запроса'));
});

module.exports = router;
