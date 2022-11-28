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
// const DB =
//   'mongodb://impruthvi:impruthvi@todolist-shard-00-00.wd9gx.mongodb.net:27017,todolist-shard-00-01.wd9gx.mongodb.net:27017,todolist-shard-00-02.wd9gx.mongodb.net:27017/natours?ssl=true&replicaSet=atlas-a3xgj5-shard-0&authSource=admin&retryWrites=true&w=majority';
mongoose
  .connect(DB, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: false,
    useUnifiedTopology: true
  })
  .then(() => console.log('Database connection successfull'));

const port = process.env.PORT || 3000;
const server = app.listen(port, () => {
  console.log(`App running on port ${port}...`);
});

process.on('unhandledRejection', err => {
  console.log(err.name, err.message);
  console.log(err);
  console.log('UNHANDLED REJECTION! 🧨 Shutting down');
  server.close(() => {
    process.exit(1);
  });
});
