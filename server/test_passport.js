const express = require('express');
const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;

const app = express();
app.use(passport.initialize());

passport.use(new GoogleStrategy({
    clientID: 'dummy',
    clientSecret: 'dummy',
    callbackURL: '/auth/google/callback'
  }, (accessToken, refreshToken, profile, done) => {
    return done(null, profile);
  }
));

app.get('/auth/google', passport.authenticate('google', { scope: ['profile', 'email'], session: false }));

// add error handler to dump error
app.use((err, req, res, next) => {
    console.error("EXPRESS ERROR:", err);
    res.status(500).send(err.stack);
});

app.listen(3333, () => console.log('Listening on 3333'));
