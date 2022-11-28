const stripe = require('stripe')(
  'sk_test_51M5Tn5SJ4MdoNNIjkLfm0ooWL2Gn457e7YKSL5l6dsqXzHy3jQaC1VEKkEgNC30pXoG6zAyKQdwzzf0kqyNenj5P00bwL6Uuq8'
);
const Tour = require('../models/tourModel');
const User = require('../models/userModel');
const Booking = require('../models/bookingModel');
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
    // success_url: `${req.protocol}://${req.get('host')}/?tour=${
    //   req.params.tourId
    // }&user=${req.user.id}&price=${tour.price}`,
    success_url: `${req.protocol}://${req.get('host')}/my-tours`,
    cancel_url: `${req.protocol}://${req.get('host')}/tours/${tour.slug}`,
    customer_email: req.user.email,
    client_reference_id: req.params.tourId,
    line_items: [
      {
        price_data: {
          currency: 'usd',
          product_data: {
            name: `${tour.name} Tour`,
            description: tour.summary,
            images: [
              `${req.protocol}://${req.get('host')}/img/tours/${
                tour.imageCover
              }`
            ]
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

// exports.createBookinfCheckout = catchAsync(async (req, res, next) => {
//   // This is only TEMPORARY, because it's UNSECURE: everyone can make booking without paying
//   const { tour, user, price } = req.query;

//   if (!tour && !user && !price) return next();
//   await Booking.create({ tour, user, price });

//   res.redirect(req.originalUrl.split('?')[0]);
// });
const createBookinfCheckout = async session => {
  const tour = session.client_reference_id;
  const user = (await User.find({ email: session.customer_email })).id;
  const price = session.line_items[0].price_data.unit_amount / 100;
  await Booking.create({ tour, user, price });
};

exports.webhookCheckout = catchAsync(async (req, res, next) => {
  const signature = req.headers['stripe-signature'];

  let event;
  try {
    event = stripe.webhooks.constructEvent(
      req.body,
      signature,
      'whsec_Ck2t3dFipH7DpR4fkmky7WaYxCfUnPNY'
    );
  } catch (err) {
    return res.status(404).send(`webhook error: ${err.message}`);
  }

  if (event.type === 'checkout.session.completed') {
    createBookinfCheckout(event.data.object);
  }

  res.status(200).json({ received: true });
});

exports.getAllBookings = factory.getAll(Booking);
exports.getBooking = factory.getOne(Booking);
exports.createBooking = factory.createOne(Booking);
exports.updateBooking = factory.updateOne(Booking);
exports.deleteBooking = factory.deleteOne(Booking);
