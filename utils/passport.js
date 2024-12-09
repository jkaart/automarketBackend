const { Strategy, ExtractJwt } = require('passport-jwt')
const User = require('../models/user')

const jwtOptions = {
  secretOrKey: process.env.SECRET,
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
}

const jwtVerify = async (payload, done) => {
  User.findById(payload.id)
    .then((user) => {
      if (!user) {
        return done(null, false)
      }
      done(null, user)
    })
    .catch((error) => done(error, false))
}

const jwtStrategy = new Strategy(jwtOptions, jwtVerify)
module.exports = { jwtStrategy }