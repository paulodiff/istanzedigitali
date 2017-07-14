var express = require('express');
var router = express.Router();
var jwt = require('jwt-simple');
var ENV   = require('../config/config.js'); // load configuration data
var User  = require('../models/user.js'); // load configuration data
var UserLogin  = require('../models/userLogin.js'); // load configuration data
var utilityModule  = require('../models/utilityModule.js'); // load configuration data
var request = require('request');
var qs = require('querystring');
var path = require('path');
var ntlm = require('express-ntlm');
var fs = require('fs');
var LdapAuth = require('ldapauth-fork');



module.exports = function(){


// Log in with LDAP



router.post('/LDAPlogin', function(req, res) {


  

  console.log('/LDAPlogin');
  // logAccess('Start logger ...');  logError('Start logger ...'); logDataAnalysis('Start logger ...');

  console.log(req.body);

  var username = req.body.username;
  var password = req.body.password;

  var config = { ldap: ENV.ldap };
  var matricoleAutorizzate = ENV.matricoleAutorizzate;

  // validazione

  /*
  //var matricole_autorizzate = /(?:[\s]|^)(M05831|M09999|M01111)(?=[\s]|$)/i;
  var matricole_autorizzate = new RegExp('(?:[\s]|^)(' + ENV.matricoleAutorizzate + ')(?=[\s]|$)' , 'i');

  if (!matricole_autorizzate.test(username)){
    logConsole("authenticate : Validation : Matricola non autorizzata");
    logError("Matricola non autorizzata: " + username);
    logDataAnalysis({action : 'matricola_non_autorizzata', eventTime: new Date(), user: {name: username}, params: {} });
    res.status(401).json({ success: false, message: 'Matricola non autorizzata' });
    return;
  }
  */

  //console.log(config);

  var bindDn = "cn=" + username + "," + config.ldap.bindDn;
  console.log(bindDn);

  var ldap = new LdapAuth({
    url: config.ldap.url,
    bindDn: bindDn,
    bindCredentials: password,
    searchBase: config.ldap.searchBase,
    searchFilter: config.ldap.searchFilter,
    //log4js: require('log4js'),
    cache: true
  });

  ldap.authenticate(username, password, function (err, user) {
    console.log('LDAP ...', username, password);
    if (err) {
      console.log(err);
      //logConsole(err);
      //logError(err);
      //logDataAnalysis({action: 'login_failed', eventTime: new Date(), user: {name : username}, params : {} });
      res.status(500).json({
                          success: false,
                          data:err
                      });
      return;
    }
    //logAccess("Accesso effettuato : " + username);    
    //logConsole('LDAP.. ')
    //logConsole(user);
    //logDataAnalysis({action: 'login_success', eventTime: new Date(), user: user,  params : {} });

    
     var userLogin = { 
          'issuer' : 'LDAP',
          'userid' : user.name,
          'name' : user.name,
          'displayName' : user.displayName,
          'userEmail' : user.mail,
          'isAdmin': false
      };

      // controllo matricole amministrative

      console.log('Controllo matricola se amministrativa', user.name);
      console.log(ENV.matricoleAmministrativeFilePath);
  
      var matricoleAmministrativeTxt = fs.readFileSync(ENV.matricoleAmministrativeFilePath).toString();
      console.log(matricoleAmministrativeTxt);
      // validazione
  
      var matricoleAmministrative = new RegExp('(?:[\s]|^)(' + matricoleAmministrativeTxt + ')(?=[\s]|$)' , 'i');
      if (matricoleAmministrative.test(user.name)){
        console.log("Check : " + user.name + "OK");
        userLogin.isAdmin = true;
      }


      console.log(userLogin);

      var token = utilityModule.createJWT(userLogin);
 
    //Session.create(res.data.id_utenti, res.data.nome_breve_utenti, res.data.token,  res.data.isadmin_utenti);
    res.status(200).json({
      success: true,
      message: 'Enjoy your token!',
      id_utenti : username,
      nome_breve_utenti : username,
      isadmin_utenti : 0,
      data: userLogin,
      token: token
    });
  });
});




// NTLM login

router.post('/NTLMlogin', ntlm(ENV.ntlm), function(req, res) {
    console.log(req.ntlm);
    console.log('login ok');
      var userLogin = { 
          'issuer' : 'NTLM',
          'userid' : req.ntlm.UserName,
          'userEmail' : req.ntlm.UserName,
          'userWorkstation' : req.ntlm.Workstation,
          'userDomainName' : req.ntlm.DomainName
      };

      console.log(userLogin);

      if (req.ntlm.UserName == ''){
        return res.status(401).send({ message: 'Invalid email and/or password' });    
      } else {
        res.send({ token: utilityModule.createJWT(userLogin) });
      }
      
      
    // {"DomainName":"MYDOMAIN","UserName":"MYUSER","Workstation":"MYWORKSTATION"}
});


 // Log in with Email
router.post('/DEMOlogin', function(req, res) {
  console.log('/DEMOlogin');
  var userLogin = { 
      'issuer' : 'DEMO',
      'userid' : 'DEMO',
      'userEmail' : 'demo@demo.com'
  };
  res.status(200).send({ token: utilityModule.createJWT(userLogin) });
    
});




 // Log in with Email
router.post('/login', function(req, res) {
  console.log('/login');
  //utilityModule.test();
  console.log('email:' + req.body.email );
  //User.findOne({ email: req.body.email }, '+password', function(err, user) {
  User.findOne({ email: req.body.email }, function(err, user) {

  	if(err){
      console.log('User.findOne error ...');
      console.log(err);
    } 
    if (!user) {
      console.log('NOT user..');
      return res.status(401).send({ message: 'Invalid email and/or password' });
    }
    user.comparePassword(req.body.password, function(err, isMatch) {
      if(err) {
        console.log('user.comparePassword error ...');
        console.log(err);
      }
      if (!isMatch) {
        console.log('user.comparePassword not Match');
        return res.status(401).send({ message: 'Invalid email and/or password' });
      }

      console.log('login ok');
      console.log(user);

      var userLogin = { 
          'userProvider' : 'email',
          'userId' : req.body.email,
          'userEmail' : req.body.email
      };

      console.log(userLogin);
      res.send({ token: utilityModule.createJWT(userLogin) });
    });

  });

});


//Create Email and Password Account
router.post('/signup', function(req, res) {
  console.log('/signup');
  User.findOne({ email: req.body.email }, function(err, existingUser) {
  	if(err) console.log(err);
    if (existingUser) {
      console.log('409 Email is already taken');
      return res.status(409).send({ message: 'Email is already taken' });
    }
    var user = new User({
      displayName: req.body.displayName,
      email: req.body.email,
      password: req.body.password
    });
    console.log('/signup saving user');
    console.log(user);
    user.save(function(err, result) {
      if (err) {
      	console.log(err);
        res.status(500).send({ message: err.message });
      }
      res.status(200).send({ token: utilityModule.createJWT(result) });
    });
  });
});


/*
 |--------------------------------------------------------------------------
 | Login with GitHub
 |--------------------------------------------------------------------------
 */

router.post('/github', function(req, res) {

  var accessTokenUrl = 'https://github.com/login/oauth/access_token';
  var userApiUrl = 'https://api.github.com/user/emails';
  var params = {
    code: req.body.code,
    client_id: req.body.clientId,
    client_secret: ENV.GITHUB_SECRET,
    redirect_uri: req.body.redirectUri
  };



  // Step 1. Exchange authorization code for access token.
  request.get({ url: accessTokenUrl, qs: params }, function(err, response, accessToken) {

    console.log('GitHub exchange ...');
    console.log(userApiUrl);


    accessToken = qs.parse(accessToken);
    var headers = { 'User-Agent': 'Satellizer' };

    // Step 2. Retrieve profile information about the current user.
    request.get({ url: userApiUrl, qs: accessToken, headers: headers, json: true }, function(err, response, profile) {

      console.log('Github retrieve profile information');
      //console.log(response);
      
      if(err) {
        console.log(err);
        res.status(409).send({ message: 'Error retrieve profile information!' });
      }

      console.log(profile);

        var user = {};
        user.id = profile[0].email;
        user.email = profile[0].email;
        user.provider = 'github';
        console.log(user);

        var userLogin = new UserLogin();
        userLogin.userId = user.id;
        userLogin.userEmail = user.email;
        userLogin.userProvider = user.provider;

        userLogin.save(function(err, userl) {

              if(err) {
                res.status(500).send({ msg: err });  
              }

              console.log('Github saving userLogin');             
              console.log(userl);
              var token = utilityModule.createJWT(userl);
              console.log(token);
              res.send({ token: token });
         });


/*


      // Step 3a. Link user accounts.
      if (req.header('Authorization')) {
        console.log('Github 3a **Authorization** search:' + profile.id);

        var user = {};
        user.id = profile[0].email;
        user.email = profile[0].email;
        user.provider = 'github';
        console.log(user);
        var token = utilityModule.createJWT(user);
        console.log('Github **send TOKEN');
        
        
        var userLogin = new UserLogin();
        userLogin.userId = user.id;
        userLogin.userEmail = user.email;
        userLogin.userProvider = user.provider;

        userLogin.save(function(err, userl) {

              if(err) {
                res.status(500).send({ msg: err });  
              }

              console.log('Github saving userLogin');             
              console.log(userl);
              var token = utilityModule.createJWT(userl);
              console.log(token);
              res.send({ token: token });
         });

  
        User.findOne({ github: profile.id }, function(err, existingUser) {

          if(err) {
            console.log(err);
            res.status(409).send({ message: 'Error finding user!' });
          }

         if (existingUser) {
            console.log('Github existing user!');
            console.log(existingUser);
            return res.status(409).send({ message: 'There is already a GitHub account that belongs to you' });
          }
          var token = req.header('Authorization').split(' ')[1];
          var payload = jwt.decode(token, ENV.secret);
          console.log(payload.sub);
          User.findById(payload.sub, function(err, user) {
            if (!user) {
              console.log('GitHub User not found');
              return res.status(400).send({ message: 'User not found' });
            }
            user.github = profile.id;
            user.provider = 'github';
            user.picture = user.picture || profile.avatar_url;
            user.displayName = user.displayName || profile.name;
            user.save(function() {
              console.log('Github saving user');             
              console.log(user);
              var token = utilityModule.createJWT(user);
              res.send({ token: token });
            });
          });
        });

 
      } else {
        // Step 3b. Create a new user account or return an existing one.
        console.log('GitHub 3b find ...' );
        console.log(profile);

        var user = {};
        user.id = profile[0].email;
        user.email = profile[0].email;
        user.provider = 'github';
        console.log(user);
        
        
        var userLogin = new UserLogin();
        userLogin.userId = user.id;
        userLogin.userEmail = user.email;
        userLogin.userProvider = user.provider;

        userLogin.save(function(user) {
              console.log(user);
              console.log('Github **send TOKEN');
              var token = utilityModule.createJWT(user);
              res.send({ token: token });
         });


        User.findOne({ github: profile.id }, function(err, existingUser) {
          if (existingUser) {
            console.log('Github existing User..');
            var token = utilityModule.createJWT(existingUser);
            return res.send({ token: token });
          }
          var user = new User();
          user.github = profile.id;
          user.picture = profile.avatar_url;
          user.displayName = profile.name;
          user.save(function(err, user ) {

            if(err) {
              console.log(err);
              res.status(409).send({ message: 'Error saving user!' });
            } else {
              console.log('Github saving user...');
              console.log(user);
              var token = utilityModule.createJWT(user);
              res.send({ token: token });
            }
          });
        });


      }  */
    });
  });
});


// Login with Google
router.post('/google', function(req, res) {
  var accessTokenUrl = 'https://accounts.google.com/o/oauth2/token';
  var peopleApiUrl = 'https://www.googleapis.com/plus/v1/people/me/openIdConnect';
  var params = {
    code: req.body.code,
    client_id: req.body.clientId,
    client_secret: ENV.GOOGLE_SECRET,
    redirect_uri: req.body.redirectUri,
    grant_type: 'authorization_code'
  };

 console.log('Google auth...1');

 
  // Step 1. Exchange authorization code for access token.
  request.post(accessTokenUrl, { json: true, form: params }, function(err, response, token) {
    var accessToken = token.access_token;
    var headers = { Authorization: 'Bearer ' + accessToken };

    console.log('Google auth...POST');

    // Step 2. Retrieve profile information about the current user.
    request.get({ url: peopleApiUrl, headers: headers, json: true }, function(err, response, profile) {

      console.log(profile);
      console.log('.........................................................');

      if (profile.error) {
        console.log('Google auth ERR');
        console.log(profile.error.message);
        return res.status(500).send({message: profile.error.message});
      }

      var user = {};
      user.id = profile.sub;
      user.email = profile.email;
      user.provider = 'google';
      console.log(user);
                
      var userLogin = new UserLogin();
      userLogin.userId = user.id;
      userLogin.userEmail = user.email;
      userLogin.userProvider = user.provider;

       userLogin.save(function(err, userl) {

              if(err) {
                res.status(500).send({ msg: err });  
              }

              console.log(' GOOGLE saving userLogin');             
              console.log(userl);
              var token = utilityModule.createJWT(userl);
              console.log(token);
              res.send({ token: token });
         });


/*

      // Step 3a. Link user accounts.
      if (req.header('Authorization')) {

        console.log('Google 3a');

        User.findOne({ google: profile.sub }, function(err, existingUser) {
          if (existingUser) {
            console.log('Google existingUser');
            console.log(existingUser);
            return res.status(409).send({ message: 'There is already a Google account that belongs to you' });
          }
          var token = req.header('Authorization').split(' ')[1];
          var payload = jwt.decode(token, ENV.secret);

          var user = {};
          user.id = profile.sub;
          user.email = profile.email;
          user.provider = 'google';
          console.log(user);
          var token = utilityModule.createJWT(user);
          console.log('Google **send TOKEN');
          res.send({ token: token });

          /*User.findById(payload.sub, function(err, user) {
            if (!user) {
              console.log('Google !user');
              return res.status(400).send({ message: 'User not found' });
            }
            user.google = profile.sub;
            user.picture = user.picture || profile.picture.replace('sz=50', 'sz=200');
            user.displayName = user.displayName || profile.name;
            user.save(function() {
              console.log('Google user saved!');
              var token = utilityModule.createJWT(user);
              res.send({ token: token });
            });
          });
          
        });
      } else {
        console.log('Google 3b');
        // Step 3b. Create a new user account or return an existing one.


        User.findOne({ google: profile.sub }, function(err, existingUser) {
          if (existingUser) {

            return res.send({ token: utilityModule.createJWT(existingUser) });
          }
          var user = new User();
          user.google = profile.sub;
          user.picture = profile.picture.replace('sz=50', 'sz=200');
          user.displayName = profile.name;
          user.save(function(err) {
            var token = utilityModule.createJWT(user);
            res.send({ token: token });
          });
        });
      }
*/

    });
  });
});

/*
 |--------------------------------------------------------------------------
 | Login with Twitter
 |--------------------------------------------------------------------------
 */
router.post('/twitter', function(req, res) {
  var requestTokenUrl = 'https://api.twitter.com/oauth/request_token';
  var accessTokenUrl = 'https://api.twitter.com/oauth/access_token';
  var profileUrl = 'https://api.twitter.com/1.1/users/show.json?screen_name=';

  console.log('TWITTER auth...*');

  // Part 1 of 2: Initial request from Satellizer.
  if (!req.body.oauth_token || !req.body.oauth_verifier) {
    var requestTokenOauth = {
      consumer_key: ENV.TWITTER_KEY,
      consumer_secret: ENV.TWITTER_SECRET,
      callback: req.body.redirectUri
    };

    // Step 1. Obtain request token for the authorization popup.
    request.post({ url: requestTokenUrl, oauth: requestTokenOauth }, function(err, response, body) {
      var oauthToken = qs.parse(body);

      // Step 2. Send OAuth token back to open the authorization screen.
      res.send(oauthToken);
    });
  } else {
    // Part 2 of 2: Second request after Authorize app is clicked.
    var accessTokenOauth = {
      consumer_key: ENV.TWITTER_KEY,
      consumer_secret: ENV.TWITTER_SECRET,
      token: req.body.oauth_token,
      verifier: req.body.oauth_verifier
    };

    // Step 3. Exchange oauth token and oauth verifier for access token.
    request.post({ url: accessTokenUrl, oauth: accessTokenOauth }, function(err, response, accessToken) {

      accessToken = qs.parse(accessToken);

      var profileOauth = {
        consumer_key: ENV.TWITTER_KEY,
        consumer_secret: ENV.TWITTER_SECRET,
        oauth_token: accessToken.oauth_token
      };

      // Step 4. Retrieve profile information about the current user.
      request.get({
        url: profileUrl + accessToken.screen_name,
        oauth: profileOauth,
        json: true
      }, function(err, response, profile) {


      console.log(profile);


      var user = {};
      user.id = profile.id;
      user.email = profile.id;
      user.provider = 'twitter';
      console.log(user);
                
      var userLogin = new UserLogin();
      userLogin.userId = user.id;
      userLogin.userEmail = user.email;
      userLogin.userProvider = user.provider;

       userLogin.save(function(err, userl) {

              if(err) {
                res.status(500).send({ msg: err });  
              }

              console.log(' TWITTER saving userLogin');             
              console.log(userl);
              var token = utilityModule.createJWT(userl);
              console.log(token);
              res.send({ token: token });
         });


/*
        // Step 5a. Link user accounts.
        if (req.header('Authorization')) {
          User.findOne({ twitter: profile.id }, function(err, existingUser) {
            if (existingUser) {
              return res.status(409).send({ message: 'There is already a Twitter account that belongs to you' });
            }

            var token = req.header('Authorization').split(' ')[1];
            var payload = jwt.decode(token, ENV.TOKEN_SECRET);

            User.findById(payload.sub, function(err, user) {
              if (!user) {
                return res.status(400).send({ message: 'User not found' });
              }

              user.twitter = profile.id;
              user.displayName = user.displayName || profile.name;
              user.picture = user.picture || profile.profile_image_url.replace('_normal', '');
              user.save(function(err) {
                res.send({ token: utilityModule.createJWT(user) });
              });
            });
          });
        } else {
          // Step 5b. Create a new user account or return an existing one.
          User.findOne({ twitter: profile.id }, function(err, existingUser) {
            if (existingUser) {
              return res.send({ token: utilityModule.createJWT(existingUser) });
            }

            var user = new User();
            user.twitter = profile.id;
            user.displayName = profile.name;
            user.picture = profile.profile_image_url.replace('_normal', '');
            user.save(function() {
              res.send({ token: utilityModule.createJWT(user) });
            });
          });
        }

*/

      });
    });
  }
});


// unlink data
router.post('/unlink', utilityModule.ensureAuthenticated, function(req, res) {
  var provider = req.body.provider;
  var providers = ['facebook', 'foursquare', 'google', 'github', 'instagram',
    'linkedin', 'live', 'twitter', 'twitch', 'yahoo'];

  if (providers.indexOf(provider) === -1) {
    return res.status(400).send({ message: 'Unknown OAuth Provider' });
  }

  User.findById(req.user, function(err, user) {
    if (!user) {
      return res.status(400).send({ message: 'User Not Found' });
    }
    user[provider] = undefined;
    user.save(function() {
      res.status(200).end();
    });
  });
});



/*
 |--------------------------------------------------------------------------
 | Login with Facebook
 |--------------------------------------------------------------------------
 */
router.post('/facebook', function(req, res) {
  var fields = ['id', 'email', 'first_name', 'last_name', 'link', 'name'];
  var accessTokenUrl = 'https://graph.facebook.com/v2.5/oauth/access_token';
  var graphApiUrl = 'https://graph.facebook.com/v2.5/me?fields=' + fields.join(',');
  var params = {
    code: req.body.code,
    client_id: req.body.clientId,
    client_secret: ENV.FACEBOOK_SECRET,
    redirect_uri: req.body.redirectUri
  };

  console.log('Facebook auth ...' + accessTokenUrl);


  // Step 1. Exchange authorization code for access token.
  request.get({ url: accessTokenUrl, qs: params, json: true }, function(err, response, accessToken) {

    console.log('Step 1');

    if (response.statusCode !== 200) {
      return res.status(500).send({ message: accessToken.error.message });
    }

    // Step 2. Retrieve profile information about the current user.
    request.get({ url: graphApiUrl, qs: accessToken, json: true }, function(err, response, profile) {

      console.log('Step 2');

      if (response.statusCode !== 200) {
        return res.status(500).send({ message: profile.error.message });
      }

      console.log(profile);

      if (req.header('Authorization')) {
        User.findOne({ facebook: profile.id }, function(err, existingUser) {
          if (existingUser) {
            return res.status(409).send({ message: 'There is already a Facebook account that belongs to you' });
          }
          var token = req.header('Authorization').split(' ')[1];
          var payload = jwt.decode(token, config.TOKEN_SECRET);
          User.findById(payload.sub, function(err, user) {
            if (!user) {
              return res.status(400).send({ message: 'User not found' });
            }
            user.facebook = profile.id;
            user.picture = user.picture || 'https://graph.facebook.com/v2.3/' + profile.id + '/picture?type=large';
            user.displayName = user.displayName || profile.name;
            user.save(function() {
              var token = createJWT(user);
              res.send({ token: token });
            });
          });
        });
      } else {
        // Step 3. Create a new user account or return an existing one.
        User.findOne({ facebook: profile.id }, function(err, existingUser) {
          if (existingUser) {
            var token = createJWT(existingUser);
            return res.send({ token: token });
          }
          var user = new User();
          user.facebook = profile.id;
          user.picture = 'https://graph.facebook.com/' + profile.id + '/picture?type=large';
          user.displayName = profile.name;
          user.save(function() {
            var token = createJWT(user);
            res.send({ token: token });
          });
        });
      }
    });
  });
});



router.all('/test', function(req,res){
	console.log('test');
	res.status(500).json({'mgs':'pong'});
});


router.get('/decodeProfile', function(req,res){
	console.log('decodeProfile');
  console.log(req.query.token);
  
  var p = utilityModule.decodeJWT(req.query.token);

  console.log(p);

  if ( p.sub && p.sub.userProvider && p.sub.userId  ) {
    res.status(200).json({'provider': p.sub.userProvider, 'userId' : p.sub.userId });
  } else {
    res.status(500).json({'mgs':'profile not decoded!'});
  }

	
});


/*
	router.all('/login', function(req, res, next) {
	  passport.authenticate('login', function(err, user, info) {
	    if (err) { 
	  			console.log(err);
	  			console.log(info);
	    		res.status(500).json({'mgs':err});
	    		return;
	    }

	    if (!user) { 
	    		console.log('not user');
	  			console.log(info);
	    		res.status(401).json({'mgs':'not user'});
	    		return;
	    	}

	    if(user) {
	    		console.log('ok');
	    		var token = jwt.sign(user, ENV.secret, { expiresIn : "2h"});
	    		res.status(200).json({'mgs':'ok user', 'user': user, 'token' : token});
	    		return;
	    }

	})(req, res, next);
	});


	router.get('/profile', isLoggedIn, function(req, res) {
        res.render('profile.ejs', {
            user : req.user // get the user out of session and pass to template
        });
    });


	router.all('/signup', function(req, res){
		res.status(500).json({'mgs':'pong'});
	});

		
	router.get('/signout', function(req, res) {
		res.status(500).json({'mgs':'pong'});
	});

	*/

	return router;
}