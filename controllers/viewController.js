const Tour = require('../models/tourModel');

exports.getOverview = async (req, res) => {
  // 1) Get Tour data from collection
  const tours = await Tour.find();
  // 2) Build template
  // 3) Render that template using tour data from 1)

  res.status(200).render('overview', {
    title: 'All Tours',
    tours
  });
};

exports.getTour = (req, res) => {
  res.status(200).render('tour', {
    title: 'The forest hiker tour'
  });
};
