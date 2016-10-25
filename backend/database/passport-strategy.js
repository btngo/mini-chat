var LocalStrategy = require('passport-local').Strategy;

var User = require('./userSchema');

module.exports = function(passport) {

  passport.serializeUser(function (user, done) {
    done(null, user.id);
  });

  passport.deserializeUser(function (id, done) {
    User.findById(id, function (err, user) {
      done(err, user);
    });
  });

  passport.use('login', new LocalStrategy({
      usernameField: 'username',
      session: false,
      passReqToCallback: true
    },
    function (req, username, password, done) {
      console.log(username, password);
      process.nextTick(function () {
        User.findOne({'username': username}, function (err, user) {
          console.log(err, user);
          if (err) {
            return done(err);
          }
          if (!user)
            return done(null, false, req.flash('error', 'User does not exist.'));

          if (!user.verifyPassword(password)) {
            console.log('login error');
            return done(null, false, req.flash('error', 'Enter correct password'));
          } else {
            console.log('login ok');
            return done(null, user);
          }
        });
      });

    }));
};

