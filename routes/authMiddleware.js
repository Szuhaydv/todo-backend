const isAuth = (req, res, next) => {
  if (req.user) {
      res.status(123).send("hallelujah")
  } else {
      res.status(401).json(req.session || "None");
  }
}

export default isAuth