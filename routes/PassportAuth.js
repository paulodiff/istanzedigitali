var express = require('express');
var router = express.Router();
var jwt = require('jwt-simple');
var utilityModule  = require('../models/utilityModule.js'); // load configuration data
var request = require('request');
var qs = require('querystring');
var path = require('path');
var passport = require('passport');
var fs = require('fs');


// http://mherman.org/blog/2015/07/02/handling-user-authentication-with-the-mean-stack/#.WKxfkG_hBpg
LocalStrategy = require('passport-local').Strategy;

passport.use(new LocalStrategy(
  function(username, password, done) {

      console.log('PASSPORT checking local strategy ... ',username,password);
        var jsonFile = './data/users.json';
        var data = JSON.parse(fs.readFileSync(jsonFile));
        console.log(data[username]);
        if (data[username]){
            console.log(data[username].password);
            if (data[username].password == password) {
                return done(null, username);
            } 
        }
        return done(null, false, { message: 'Incorrect username or password.' });
      
  }
));


// Passport authentication

module.exports = function(){


// esegue una chiamata alla strategy "local" con req.logIn e se ok invia un token JWT

router.post('/login', function(req, res, next) {

  console.log('PASSPORT:/login ... ');
  passport.authenticate('local', function(err, user, info) {

    if (err) {
        console.log('PASSPORT:/login',err);
      return next(err);
    }
    if (!user) {
        console.log('PASSPORT:/login NOT USER');
      return res.status(401).json({
        err: info
      });
    }
    req.logIn(user, function(err) {
      if (err) {
        return res.status(500).json({  err: 'Could not log in user'  });
      }
      console.log(user);
      res.status(200).send({ token: utilityModule.createJWT(user), status : 'Login succesful!' });
      // res.status(200).json({ status: 'Login successful!'   });
    });
  })(req, res, next);
});


// esegue il logout dal sistema
router.post('/logout',  utilityModule.ensureAuthenticated, function(req, res){
    console.log('PASSPORT:/login ... ');
    console.log(req.csrfToken());
    req.logout();
    res.status(200).send({ token: '', status : 'Logged out!' });
});








	return router;
}

