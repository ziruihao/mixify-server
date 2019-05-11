import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import morgan from 'morgan';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import querystring from 'query-string';
import cookieParser from 'cookie-parser';
import request from 'request';

import mixRouter from './routes/mix-router';

dotenv.config({ silent: true });

// authenticator variables
var client_id = process.env.CLIENT_ID;
var client_secret = process.env.CLIENT_SECRET;
// var auth_client_redirect_uri = 'https://mixify-server.herokuapp.com/authOwner/callback';
var auth_client_redirect_uri = 'http://localhost:9090/authOwner/callback';
// var get_token_redirect_uri = 'https://mixify-server.herokuapp.com/authCollaborator/callback';
var get_token_redirect_uri = 'http://localhost:9090/authCollaborator/callback';
// var client_uri = 'http://mixify-client.surge.sh/auth';
var client_uri = 'http://localhost:8080/auth';
var stateKey = 'spotify_auth_state';

/**
 * Generates a random string containing numbers and letters
 * @param  {number} length The length of the string
 * @return {string} The generated string
 */
var generateRandomString = function(length) {
  var text = '';
  var possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';

  for (var i = 0; i < length; i++) {
    text += possible.charAt(Math.floor(Math.random() * possible.length));
  }
  return text;
};

// initialize
const app = express();

// enable/disable cross origin resource sharing if necessary
app.use(cors());

// cookie parser
app.use(cookieParser());

// enable/disable http request logging
app.use(morgan('dev'));

// enable json message body for posting data to API
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// adding cors
app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});

app.get('/', (req, res) => {
  res.send('hi');
});

app.use('/mixes', mixRouter);

/**
 * This route handles requests from mixify-client to authenticate the main user into the app.
 */
app.get('/authOwner', (req, res) => {
  var state = generateRandomString(16);
  res.cookie(stateKey, state);

  var scope = 'user-read-private user-read-email streaming user-read-birthdate user-top-read user-library-read playlist-modify-public user-follow-read user-read-playback-state user-modify-playback-state playlist-read-private user-library-modify playlist-read-collaborative playlist-modify-private user-read-currently-playing user-read-recently-played';
  res.redirect('https://accounts.spotify.com/authorize?' +
    querystring.stringify({
      response_type: 'code',
      client_id: client_id,
      scope: scope,
      redirect_uri: auth_client_redirect_uri,
      state: state
    }));
});

/**
 * Callback for the above route.
 */
app.get('/authOwner/callback', (req, res) => {
  var code = req.query.code || null;
  var state = req.query.state || null;
  var storedState = req.cookies ? req.cookies[stateKey] : null;
  if (state === null || state !== storedState) {
    res.redirect('/#' +
      querystring.stringify({
        error: 'state_mismatch'
      }));
  } else {
    res.clearCookie(stateKey);
    var authOptions = {
      url: 'https://accounts.spotify.com/api/token',
      form: {
        code: code,
        redirect_uri: auth_client_redirect_uri,
        grant_type: 'authorization_code'
      },
      headers: {
        'Authorization': 'Basic ' + (new Buffer(client_id + ':' + client_secret).toString('base64'))
      },
      json: true
    };

    request.post(authOptions, function(error, response, body) {
      if (!error && response.statusCode === 200) {

        var access_token = body.access_token,
            refresh_token = body.refresh_token;

        var options = {
          url: 'https://api.spotify.com/v1/me',
          headers: { 'Authorization': 'Bearer ' + access_token },
          json: true
        };

        request.get(options, function(error, response, body) {
          console.log(body);
        });

        res.redirect(`${client_uri}/` +
          access_token
        );
      } else {
        res.redirect('/#' +
          querystring.stringify({
            error: 'invalid_token'
          }));
      }
    });
  }
});


/**
 * This route handles secondary requests from the client to get tokens for collaborators.
 */
app.get('/authCollaborator', (req, res) => {
  var state = generateRandomString(16);
  res.cookie(stateKey, state);
  res.cookie('mixId', req.query.mixId);

  var scope = 'user-read-private user-read-email streaming user-read-birthdate user-top-read user-library-read playlist-modify-public user-follow-read user-read-playback-state user-modify-playback-state playlist-read-private user-library-modify playlist-read-collaborative playlist-modify-private user-read-currently-playing user-read-recently-played';
  res.redirect('https://accounts.spotify.com/authorize?' +
    querystring.stringify({
      response_type: 'code',
      client_id: client_id,
      scope: scope,
      redirect_uri: get_token_redirect_uri,
      state: state
    }));
});

/**
 * Callback for above route.
 */
app.get('/authCollaborator/callback', (req, res) => {
  var code = req.query.code || null;
  var state = req.query.state || null;
  var storedState = req.cookies ? req.cookies[stateKey] : null;
  var mixId = req.cookies? req.cookies['mixId'] : null;
  console.log(req.cookies['mixId']);
  if (state === null || state !== storedState || mixId === null) {
    res.redirect('/#' +
      querystring.stringify({
        error: 'state_mismatch'
      }));
  } else {
    res.clearCookie(stateKey);
    res.clearCookie('mixId');
    var authOptions = {
      url: 'https://accounts.spotify.com/api/token',
      form: {
        code: code,
        redirect_uri: get_token_redirect_uri,
        grant_type: 'authorization_code'
      },
      headers: {
        'Authorization': 'Basic ' + (new Buffer(client_id + ':' + client_secret).toString('base64'))
      },
      json: true
    };

    request.post(authOptions, function(error, response, body) {
      if (!error && response.statusCode === 200) {

        var access_token = body.access_token,
            refresh_token = body.refresh_token;

        var options = {
          url: 'https://api.spotify.com/v1/me',
          headers: { 'Authorization': 'Bearer ' + access_token },
          json: true
        };

        request.get(options, function(error, response, body) {
          console.log(body);
        });

        // res.send({
        //   access_token: access_token,
        // });

        res.redirect(`${client_uri}/` + access_token + '?' + 
        querystring.stringify({
          isCollaborator: 'true',
          mixId, 
        })
      );

      } else {
        res.redirect('/#' +
          querystring.stringify({
            error: 'invalid_token'
          }));
      }
    });
  }
});

app.get('/refresh_token', function(req, res) {

  // requesting access token from refresh token
  var refresh_token = req.query.refresh_token;
  var authOptions = {
    url: 'https://accounts.spotify.com/api/token',
    headers: { 'Authorization': 'Basic ' + (new Buffer(client_id + ':' + client_secret).toString('base64')) },
    form: {
      grant_type: 'refresh_token',
      refresh_token: refresh_token
    },
    json: true
  };

  request.post(authOptions, function(error, response, body) {
    if (!error && response.statusCode === 200) {
      var access_token = body.access_token;
      res.send({
        'access_token': access_token
      });
    }
  });
});

// START THE SERVER
// =============================================================================
const port = process.env.PORT || 9090;
app.listen(port);

// DB Setup
const mongoURI = process.env.MONGODB_URI || 'mongodb://localhost/mixify';
mongoose.connect(mongoURI);
// set mongoose promises to es6 default
mongoose.Promise = global.Promise;

console.log(`listening on: ${port}`);
