const isAuth = (req, res, next) => {
  if (req.user) {
      res.status(123).send(req.user)
  } else if (req.session.passport.user) {
      res.status(234).send(req.session.passport.user)
  } else {
      res.status(401).json({ msg: 'You are fkn stupid or something' });
  }
}

export default isAuth