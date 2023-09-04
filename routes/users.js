const router = require('express').Router();
const celebrate = require('../middlewares/celebrate');

const {
  getCurrentUser,
  updateUser,
} = require('../controllers/users');

router.get('/me', getCurrentUser);
router.patch('/me', celebrate.validateUpdateUser, updateUser);

module.exports = router;
