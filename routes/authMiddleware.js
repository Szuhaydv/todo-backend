const isAuth = (req, res, next) => {
  if (req.isAuthenticated()) {
      res.status(123).send(req.session)
  } else {
      res.status(401).json(req.session);
  }
}

export default isAuth