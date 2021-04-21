const express = require('express');
const mongoose = require('mongoose');
const morgan = require('morgan');

const app = express();

const PORT = process.env.PORT || 3000;

app.use(morgan('dev'));

app.use(express.static('public'));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

mongoose.connect(
  process.env.MONGODB_URI || 'mongodb://localhost/fitnesstracker',
  {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
    useFindAndModify: false,
  }
);

app.use(require('./routes/apiRoutes'));
app.use(require('./routes/htmlRoutes'));

app.listen(PORT, () => {
  console.log(`App running on port ${PORT}!`);
});
