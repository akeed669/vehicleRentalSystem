const express = require('express');
const app = express();
require('dotenv').config();

app.use(express.json({ extended: false }));

app.get('/', (req, res) => res.send('Server running...'));
app.use(function (req, res, next) {
  res.header('Access-Control-Allow-Origin', '*');
  res.header(
    'Access-Control-Allow-Headers',
    'Origin, X-Requested-With, Content-Type, Accept'
  );
  next();
});

app.use('/api/records', require('./routes/records'));
app.use('/api/prices', require('./routes/prices'));
app.use('/api/customers', require('./routes/customers'));

const PORT = process.env.SERVER_PORT;
app.listen(PORT, () => console.log(`Server started at  ${PORT}`));
