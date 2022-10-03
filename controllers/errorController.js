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
  if (process.env.NODE_ENV === 'devlopment') {
    sendErrDev(err, res);
  } else if (process.env.NODE_ENV === 'production') {
    sendErrProd(err, res);
  }
};
