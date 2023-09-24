module.exports.cors = (req, res, next) => {
  const { origin } = req.headers;
  const { method } = req;
  const allowedCors = [
    'https://praktikum.tk',
    'http://praktikum.tk',
    'https://api.diplomtzarbasil.nomoredomainsicu.ru',
    'http://api.diplomtzarbasil.nomoredomainsicu.ru',
    'api.diplomtzarbasil.nomoredomainsicu.ru',
    'http://localhost',
  ];
  const DEFAULT_ALLOWED_METHODS = 'GET,HEAD,PUT,PATCH,POST,DELETE';
  const requestHeaders = req.headers['access-control-request-headers'];

  if (allowedCors.includes(origin)) {
    // res.header('Access-Control-Allow-Origin', origin);
    res.header('Access-Control-Allow-Origin', '*');
  }

  if (method === 'OPTIONS') {
    res.header('Access-Control-Allow-Methods', DEFAULT_ALLOWED_METHODS);
    res.header('Access-Control-Allow-Headers', requestHeaders);
    return res.end();
  }

  return next();
};
