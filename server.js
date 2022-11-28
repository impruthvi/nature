const mongoose = require('mongoose');
const dotenv = require('dotenv');
const app = require('./app');

process.on('uncaughtException', err => {
  console.error('UNCAUGHT EXCEPTION! Shutting down..');
  console.log(err.name, err.message);
  process.exit(1);
});

dotenv.config({ path: './config.env' });

const DB = process.env.DATABASE.replace(
  '<PASSWORD>',
  process.env.DATABASE_PASSWORD
);

// console.log(DB);
// const DB = '';
mongoose.connect(
  'mongodb+srv://impruthvi:impruthvi@todolist.wd9gx.mongodb.net/natours?retryWrites=true&w=majority/todoListDB',
  {
    useNewUrlParser: true
  }
);
// mongoose.connect(
//   'mongodb+srv://impruthvi:impruthvi@todolist.wd9gx.mongodb.net/natours?retryWrites=true&w=majority',
//   {
//     useNewUrlParser: true,
//     useCreateIndex: true,
//     useFindAndModify: false,
//     useUnifiedTopology: true
//   }
// );

const port = process.env.PORT || 3000;
const server = app.listen(port, () => {
  console.log(`App running on port ${port}...`);
});

// process.on('unhandledRejection', err => {
//   console.log(err.name, err.message);
//   // console.log(err);
//   console.log('UNHANDLED REJECTION! 🧨 Shutting down');
//   server.close(() => {
//     process.exit(1);
//   });
// });
