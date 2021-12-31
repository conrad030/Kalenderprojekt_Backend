function checkAuthentication(req, res, next) {
  //If user is authenticated
  if (req.session.userId) {
    next();
  } else {
    res.status(401).json({ message: "unauthenticated" });
  }
}

function checkAuthorization(req, res, next) {
  //If user is authorized
  if (req.session.isAdmin) {
    next();
  } else {
    res.status(403).json({ message: "Not authorized" });
  }
}

module.exports = {
  checkAuthentication,
  checkAuthorization,
};
