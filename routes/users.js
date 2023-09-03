// # возвращает информацию о пользователе (email и имя)
// GET /users/me

// # обновляет информацию о пользователе (email и имя)
// PATCH /users/me

const router = require('express').Router();
const { auth } = require('../middlewares/auth');
const celebrate = require('../middlewares/celebrate');

const {
  getCurrentUser,
  updateUser,
} = require('../controllers/users');

router.use(auth);
router.get('/me', getCurrentUser);
router.patch('/me', celebrate.validateUpdateUser, updateUser);

module.exports = router;
