const { celebrate, Joi } = require('celebrate');

const regexValidation = /(http(s)?:\/\/.)?(www\.)?[-a-zA-Z0-9@:%._\\+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_\\+.~#?&//=]*)/;

const validateCreatMovie = celebrate({
  body: Joi.object().keys({
    country: Joi.string().required(),
    director: Joi.string().required(),
    duration: Joi.number().required(),
    year: Joi.string().required().min(4),
    description: Joi.string().required(),
    image: Joi.string().required().regex(regexValidation),
    trailerLink: Joi.string().required().regex(regexValidation),
    thumbnail: Joi.string().required().regex(regexValidation),
    nameRU: Joi.string().required(),
    nameEN: Joi.string().required(),
    movieId: Joi.number().required(),
  }),
});

const validateMovieId = celebrate({
  // валидируем параметры
  params: Joi.object().keys({
    _id: Joi.string().hex().length(24).required(),
  }),
});

const validateUpdateUser = celebrate({
  body: Joi.object().keys({
    name: Joi.string().required().min(2).max(30),
    email: Joi.string().required().min(2).max(30),
  }),
});

const validateLoginUser = celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().email(),
    password: Joi.string().required(),
  }),
});

const validateCreateUser = celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().email(),
    password: Joi.string().required(),
    name: Joi.string().required().min(2).max(30),
  }),
});

module.exports = {
  validateCreatMovie,
  validateMovieId,
  validateLoginUser,
  validateCreateUser,
  validateUpdateUser,
};
