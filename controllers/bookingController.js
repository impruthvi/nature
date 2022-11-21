const stripe = require('stripe')(
  'sk_test_51M5Tn5SJ4MdoNNIjkLfm0ooWL2Gn457e7YKSL5l6dsqXzHy3jQaC1VEKkEgNC30pXoG6zAyKQdwzzf0kqyNenj5P00bwL6Uuq8'
);
const Tour = require('../models/tourModel');
const catchAsync = require('../units/catchAsync');
const factory = require('./factoryHandler');
const AppError = require('../units/appError');

exports.getCheckoutSession = catchAsync(async (req, res, next) => {
  // 1) Get the currently booked tour
  const tour = await Tour.findById(req.params.tourId);

  // 2) Create checkout session
  const session = await stripe.checkout.sessions.create({
    payment_method_types: ['card'],
    mode: 'payment',
    success_url: `${req.protocol}://${req.get('host')}/`,
    cancel_url: `${req.protocol}://${req.get('host')}/tour/${tour.slug}`,
    customer_email: req.user.email,
    client_reference_id: req.params.tourId,
    line_items: [
      {
        price_data: {
          currency: 'usd',
          product_data: {
            name: `${tour.name} Tour`,
            description: tour.summary,
            images: [`https://www.natours.dev/img/tours/${tour.imageCover}`]
          },
          unit_amount: tour.price * 100
        },
        // price: tour.price * 100,
        quantity: 1
      }
    ]
  });
  // 3) Create session as response
  res.status(200).json({
    status: 'success',
    session
  });
});
