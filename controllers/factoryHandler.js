const AppError = require('../units/appError');
const catchAsync = require('../units/catchAsync');

exports.deleteOne = Model =>
  catchAsync(async (req, res, next) => {
    const doc = await Model.findByIdAndDelete(req.params.id);
    if (!doc) {
      return next(new AppError('Not document found on this ID', 404));
    }
    res.status(200).json({
      status: 'success',
      data: null
    });
  });
