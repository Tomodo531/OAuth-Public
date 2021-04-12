/* ----------------------------- OAuth2.0 Setup Start ----------------------------- */
const passport = require('passport');
const bcrypt = require('bcryptjs');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const LocalStrategy = require('passport-local').Strategy;
const User = require('../models/User')
const userLimit = require('../routes/userLimit')

passport.serializeUser(function(user, done) {
    console.log('user: ', user)
    done(null, user);
});

passport.deserializeUser(function(obj, done) {
    console.log('obj: ', obj)
    done(null, obj);
});

/* ----------------------------- OAuth2.0 Google Start ----------------------------- */

passport.use(new GoogleStrategy({
    clientID: `${process.env.clientID}`,
    clientSecret: `${process.env.clientSecret}`,
    callbackURL: "/auth/google/callback"
  },
  function(accessToken, refreshToken, profile, done) {

    User.findOne({$or: [{googleId: profile.id}, {googleId: null, email: profile.emails[0].value}]}).then((user) => {

        if(user === null){
            new User({
                name: `${profile.name.givenName} ${profile.name.familyName}`,
                email: profile.emails[0].value,
                password: null,
                picture: profile.photos[0].value,
                googleId: profile.id  
            }).save().then((newUser) => {
                userLimit();
                console.log('newUser: ', newUser);
                done(null, newUser);
            }).catch((err) => done(err, null));  

        }else if(user.googleId === profile.id){
            done(null, user);
        }else if(user.googleId === null){
            done(null, false);
        }
    });    
  }
));

/* ----------------------------- OAuth2.0 Local Start ----------------------------- */

passport.use(
    new LocalStrategy((username, password, done) => {
        User.findOne({email: username}, (err, user) => {
            if (err) throw err;
            if (!user) return done(null, false);
            if (user.googleId !== null) return done(null, false);
            bcrypt.compare(password, user.password, (err, result) => {
                if (err) throw err;
                if (result === true) {
                  return done(null, user);
                } else {
                  return done(null, false);
                }
              });   
        });
    })
  );


