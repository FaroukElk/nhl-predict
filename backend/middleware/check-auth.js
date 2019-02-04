const jwt = require('jsonwebtoken');
const fs = require('fs');
const publicKey = fs.readFileSync('./public.key', 'utf8');

module.exports = (req, res, next) => {
  try {
    const token = req.headers.authorization.split(" ")[1];
    const decodedToken = jwt.verify(token, publicKey, {algorithm: "RS256"});
    req.userData = { email: decodedToken.email, userId: decodedToken.userId };
    next();
  }
  catch (error) {
    res.status(401).json({ message: "Auth failed!" });
  }
};
