// # возвращает все сохранённые текущим пользователем фильмы
// GET /movies

// # создаёт фильм с переданными в теле
// # country, director, duration, year, description, image, trailer,
// nameRU, nameEN и thumbnail, movieId
// POST /movies

// # удаляет сохранённый фильм по id
// DELETE /movies/_id

const router = require('express').Router();
const celebrate = require('../middlewares/celebrate');

const {
  getMovies,
  deleteMovie,
  createMovie,
} = require('../controllers/movies');

router.get('/', getMovies);
router.delete('/:_id', celebrate.validateMovieId, deleteMovie);
router.post('/', celebrate.validateCreatMovie, createMovie);

module.exports = router;
