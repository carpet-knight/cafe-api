const express = require('express');
const mongoose = require('mongoose');
const session = require('express-session');
const MongoStore = require('connect-mongo').default;

const { notFoundHandler, basicHandler } = require('./middleware/errorHandlers');


require('dotenv').config();

/*********************************************************************************/

const HOST = process.env.HOST || 'localhost';
const PORT = process.env.PORT || 9000;
const DB_URI = process.env.DB_URI;
const PRODUCTION = process.env.NODE_ENV === 'production';

const mongoOptions = {
  useCreateIndex: true,
  useNewUrlParser: true,
  useFindAndModify: false,
  useUnifiedTopology: true
}

const sessionOptions = {
  name: 'sid',
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: false,
  cookie: {
    path: '/api',
    httpOnly: true,
    sameSite: true,
    secure: PRODUCTION,
    maxAge: 1000 * 60 * 60 * 24 * 7 // one week (milliseconds)
  }
}

/*********************************************************************************/

const app = express();

app.set('x-powered-by', false);

mongoose.connect(DB_URI, mongoOptions)
  .then(({ connection }) => {
    // add MongoDB session store
    sessionOptions.store = MongoStore.create({
      clientPromise: Promise.resolve(connection.getClient()),
      touchAfter: 3600 * 24 * 7 // one week (seconds)
    });

    // third party middleware
    app.use('/api', session(sessionOptions));
    app.use('/api', express.json());

    // api routes
    app.use('/api', require('./routes/auth'));
    app.use('/api/users', require('./routes/users'));

    // error handling
    app.use(notFoundHandler);
    app.use(basicHandler);

    app.listen(PORT, HOST, () => console.log(`Running on http://${HOST}:${PORT}`));
  })
  .catch((err) => {
    console.error('DB connection failed.\nError:', err.message);
    process.exit(1);
  });
