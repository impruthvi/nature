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
const sendErrDev = (err, res) => {
  res.status(err.statusCode).json({
    status: err.status,
    message: err.message,
    err: err,
    stack: err.stack
  });
};

const sendErrProd = (err, res) => {
  // Operational, trusted error: send message to client
  if (err.isOperational) {
    res.status(err.statusCode).json({
      status: err.status,
      message: err.message
    });

    // Programming or other error: don't leak error details
  } else {
    // 1) Log error message
    console.error('Error 💣', err);

    // 2) Send ganeric message
    res.status(500).json({
      status: 'error',
      message: 'Somthing went very wrong'
    });
  }
};

module.exports = (err, req, res, next) => {
  err.statusCode = err.statusCode || 500;
  err.status = err.status || 'fail';
  if (process.env.NODE_ENV === 'development') {
    sendErrDev(err, res);
  } else if (process.env.NODE_ENV === 'production') {
    // console.error(err.code);
    if (err.name === 'CastError') err = handleCastError(err);
    if (err.code === 11000) err = handleDuplicateFieldsDB(err);
    if (err.name === 'ValidationError') err = handleValidationFieldsDB(err);

    sendErrProd(err, res);
  }
};
