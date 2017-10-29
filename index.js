const express = require('express')
const app = express()

var google = require('googleapis');
var OAuth2 = google.auth.OAuth2;
var plus = google.plus('v1');
var ppl = google.people('v1');

var oauth2Client = new OAuth2(
  '506583890178-j4qamjr1lfo4fdk2saqpr1lflakfoe56.apps.googleusercontent.com',
  'p7z0LvyC2Sj_0VgKoX1MkVwm',
  'http://localhost:3000/token'
);

// set auth as a global default
google.options({
  auth: oauth2Client
});

// generate a url that asks permissions for Google+ and Google Calendar scopes
var scopes = [
  'https://www.googleapis.com/auth/plus.me',
  'https://www.googleapis.com/auth/calendar',
  'https://www.googleapis.com/auth/contacts.readonly',
  'https://www.googleapis.com/auth/contacts'
];

var url = oauth2Client.generateAuthUrl({
  // 'online' (default) or 'offline' (gets refresh_token)
  access_type: 'offline',

  // If you only need one scope you can pass it as a string
  scope: scopes,

  // Optional property that passes state parameters to redirect URI
  // state: { foo: 'bar' }
});

//app home page
app.get('/', function (req, res) {
  res.sendFile( __dirname + "/home.html" );
})

app.get('/get-contacts', function (req, res) {
  res.redirect(url);
})

app.get('/token', function (req, res) {
  oauth2Client.getToken(req.query.code, function (err, tokens) {
    // Now tokens contains an access_token and an optional refresh_token. Save them.
    if (!err) {
      // Retrieve tokens via token exchange explained above or set them:
      oauth2Client.setCredentials({
        access_token: tokens.access_token,
        refresh_token: tokens.refresh_token
      });
    }
    res.redirect('/success')
  });
})

app.get('/success', function (req, res) {
  ppl.people.connections.list({
    'resourceName': 'people/me',
    'pageSize': 100,
    'personFields': 'names,emailAddresses',
  }, function (err, response) {
    // handle err and response
    //console.log('Response is here',response)
    res.send(response)
  });
})

app.listen(3000, function () {
  console.log('Example app listening on port 3000!')
})