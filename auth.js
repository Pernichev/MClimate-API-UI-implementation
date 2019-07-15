module.exports.isAuth = function isAuthenticated(req, res, next) {
  if (req.cookies.access_token) return next();

  res.redirect("/");
};
