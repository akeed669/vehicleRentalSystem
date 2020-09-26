const jwt = require('jsonwebtoken');
const Customer = require('../models/userModel');
//const config = require('config');

module.exports = async (req, res, next) => {
  const token = req.header('x-auth-token');
  if (!token) return res.status(401).send('Access denied. No token provided.');

  try {
    const decoded = jwt.verify(token, config.get('jwtPrivateKey'));
    //const decoded = jwt.verify(token, process.env.JWT_SECRET);
    console.log(decoded)
    const { userId, exp } = await jwt.verify(token, process.env.JWT_SECRET);
    //Check if token has expired
    console.log(userId)
    if (exp < Date.now().valueOf() / 1000) {
      return res.status(401).json({ error: "JWT token has expired, please login to obtain a new one" });
    }
    res.locals.loggedInUser = await Customer.findById(userId);
    console.log(res.locals.loggedInUser)

    req.user = decoded;
    next();
  }
  catch (ex) {
    res.status(400).send('Invalid token.');
    console.log(ex)
  }
}
