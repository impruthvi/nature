const AppError = require('../units/appError');

const handleCastError = err => {
  const message = `Invalid ${err.path}: ${err.value}`;
  return new AppError(message, 404);
};
const handleDuplicateFieldsDB = err => {
  const value = err.message.match(/(["'])(?:(?=(\\?))\2.)*?\1/)[0];

  const message = `Dumplicate field value: ${value}. Please use another value!!`;
  return new AppError(message, 400);
};

const handleValidationFieldsDB = err => {
  const errors = Object.values(err.errors).map(el => el.message);

  const message = `Invalid input data. ${errors.join(', ')}`;
  return new AppError(message, 400);
};

const handleJWTError = () =>
  new AppError('Invalid Token. Please login again.', 401);

const handleJWTExpiredError = () =>
  new AppError('Your Token has expired. Please try again', 401);

const sendErrDev = (err, req, res) => {
  // A) API
  if (req.originalUrl.startsWith('/api')) {
    return res.status(err.statusCode).json({
      status: err.status,
      message: err.message,
      err: err,
      stack: err.stack
    });
  }
  // B) RENDERED WEBSITE
  // 1) Log error message
  console.error('Error 💣', err);

  return res.status(err.statusCode).render('error', {
    title: 'Somthing went wrong',
    msg: err.message
  });
};

const sendErrProd = (err, req, res) => {
  // A) API
  if (req.originalUrl.startsWith('/api')) {
    // a) Operational, trusted error: send message to client
    if (err.isOperational) {
      return res.status(err.statusCode).json({
        status: err.status,
        message: err.message
      });

      // b) Programming or other error: don't leak error details
    }

    // 1) Log error message
    console.error('Error 💣', err);

    // 2) Send ganeric message
    return res.status(500).json({
      status: 'error',
      message: 'Somthing went very wrong'
    });
  }

  // B) RENDERED WEBSITE
  // a) Operational, trusted error: send message to client
  if (err.isOperational) {
    return res.status(err.statusCode).render('error', {
      title: 'Somthing went wrong',
      msg: err.message
    });

    // b) Programming or other error: don't leak error details
  }
  // 1) Log error message
  console.error('Error 💣', err);

  // 2) Send ganeric message
  return res.status(err.statusCode).render('error', {
    title: 'Somthing went wrong',
    msg: 'Please try again later'
  });
};

module.exports = (err, req, res, next) => {
  err.statusCode = err.statusCode || 500;
  err.status = err.status || 'fail';
  if (process.env.NODE_ENV === 'development') {
    sendErrDev(err, req, res);
  } else if (process.env.NODE_ENV === 'production') {
    // console.error(err.code);
    if (err.name === 'CastError') err = handleCastError(err);
    if (err.code === 11000) err = handleDuplicateFieldsDB(err);
    if (err.name === 'ValidationError') err = handleValidationFieldsDB(err);
    if (err.name === 'JsonWebTokenError') err = handleJWTError(err);
    if (err.name === 'TokenExpiredError') err = handleJWTExpiredError(err);

    sendErrProd(err, req, res);
  }
};
