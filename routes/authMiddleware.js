const isAuth = (req, res, next) => {
  if (req.isAuthenticated()) {
      next();
  } else {
      res.status(401).json({ msg: 'You are fkn stupid or something' });
  }
}

export default isAuth