const express = require('express');
const mongoose = require('mongoose');


require('dotenv').config();

/*********************************************************************************/

const HOST = process.env.HOST || 'localhost';
const PORT = process.env.PORT || 9000;
const DB_URI = process.env.DB_URI;

/*********************************************************************************/

const app = express();

app.set('x-powered-by', false);

mongoose.connect(DB_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => {
    app.listen(PORT, HOST, () => console.log(`Running on http://${HOST}:${PORT}`));
  })
  .catch((err) => {
    console.error('DB connection failed.\nError:', err.message);
    process.exit(1);
  });

mongoose.connection.on('error', (err) => console.error(err));
