const Movie = require('../models/movie');

const BadRequestError = require('../utils/BadRequestError');

const ForbiddenError = require('../utils/ForbiddenError');

const NotFoundError = require('../utils/NotFoundError');

const createMovie = (req, res, next) => {
  const {
    country, director,
    duration, year, description, image, trailerLink, thumbnail, nameRU, nameEN, movieId,
  } = req.body;
  Movie.create({
    country,
    director,
    duration,
    year,
    description,
    image,
    trailerLink,
    thumbnail,
    nameRU,
    nameEN,
    movieId,
    owner: req.user._id,
  })
    .then((movie) => {
      res.send(movie);
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        next(
          new BadRequestError(
            'Переданы некорректные данные при создании фильма',
          ),
        );
      } else {
        next(err);
      }
    });
};

const getMovies = (req, res, next) => {
  const { _id: userId } = req.user;
  Movie.find({ owner: userId })
    .then((movies) => {
      res.send(movies);
    })
    .catch(next);
};

const deleteMovie = (req, res, next) => {
  const { _id: movieId } = req.params;

  Movie.findById(movieId)
    .then((movie) => {
      if (!movie) {
        throw new NotFoundError('Фильм с указанным id не найден');
      } else if (movie.owner.toString() !== req.user._id) {
        return Promise.reject(
          new ForbiddenError('Вы не можете удалить этот фильм'),
        );
      }
      return Movie.findByIdAndRemove(movieId)
        .then(() => res.status(200).send({ message: 'Фильм удалён' }));
    })
    .catch(next);
};

module.exports = {
  createMovie,
  getMovies,
  deleteMovie,
};
