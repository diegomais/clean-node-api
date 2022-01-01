const cors = (req, res, next) => {
  res.set('access-control-allow-headers', '*')
  res.set('access-control-allow-methods', '*')
  res.set('access-control-allow-origin', '*')
  next()
}

module.exports = cors
