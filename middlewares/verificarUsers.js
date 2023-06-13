module.exports = (req, res, next) => {
  if (req.isAuthenticated()) {
    //metodo de passport.
    return next();
  }
  res.redirect("/auth/login");
};
