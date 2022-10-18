const User = require('../models/userModel');
const AppError = require('../units/appError');
const catchAsync = require('../units/catchAsync');
const factory = require('./factoryHandler');

const filterObj = (obj, ...allowdFields) => {
  const newObj = {};
  Object.keys(obj).forEach(el => {
    if (allowdFields.includes(el)) newObj[el] = obj[el];
  });
  return newObj;
};

exports.updateMe = catchAsync(async (req, res, next) => {
  // 1) Create error if user POSTs password data
  if (req.body.password || req.body.passwordConfirm) {
    return next(
      new AppError(
        'This route is not for password update. Please use /updateMyPassword',
        400
      )
    );
  }
  // 2) Filtered out unwanted fields name that are not allowd to be updated
  const filteredBody = filterObj(req.body, 'name', 'email');
  // 3) Update user document
  const updatedUser = await User.findByIdAndUpdate(req.user.id, filteredBody, {
    new: true
  });
  res.status(200).json({
    status: 'success',
    data: {
      updatedUser
    }
  });
});

exports.deleteMe = catchAsync(async (req, res, next) => {
  await User.findByIdAndUpdate(req.user.id, { active: false });
  res.status(204).json({
    status: 'sucess',
    data: null
  });
});

exports.getAllUsers = factory.getAll(User);
exports.getUser = factory.getOne(User);

// Don't update the passwords with this!
exports.updateUser = factory.updateOne(User);
exports.deleteUser = factory.deleteOne(User);
