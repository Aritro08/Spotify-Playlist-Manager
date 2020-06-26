const express = require('express');
const bodyParser = require('body-parser');
const querystring = require('query-string');
const cors = require('cors');
const axios = require('axios').default;
const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));

const clientId = '5b07a8e4896f49d5b8ebec1da157fa4c';
const clientSecret = '6600e1f4a60646c4a04acff3b175885b';
const redirectUri = 'http://localhost:3000/callback';
const deviceId = '70d6e48f660baffc40f3b25f7a1ae2b366be9731';
const scope = 'user-follow-read user-read-recently-played user-library-read user-read-playback-state user-library-modify user-read-currently-playing user-modify-playback-state';

let tokenData = null;
let userData = null;

app.use(cors());

app.get('/login', (req, res, next) => {
  res.redirect('https://accounts.spotify.com/authorize?' +
    querystring.stringify({
      response_type: 'code',
      client_id: clientId,
      redirect_uri: redirectUri,
      scope: scope
    }));
});

app.get('/callback', (req, res, next) => {
  const code = req.query.code;
  const state = req.query.state;
  if (state !== null) {
    //fetch access token using auth code
    axios({
      method: 'post',
      url:'https://accounts.spotify.com/api/token',
      params: {
        client_id: clientId,
        client_secret: clientSecret,
        code: code,
        grant_type :'authorization_code',
        redirect_uri: redirectUri
      },
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      }
    }).then(resData => {
      //store token in global var
      tokenData = {
        accessToken: resData.data.access_token,
        expiresIn: resData.data.expires_in
      };
      //fetch user details
      axios({
        method: 'get',
        url: 'https://api.spotify.com/v1/me',
        headers: { 'Authorization': 'Bearer ' + resData.data.access_token }
      }).then(resUserData => {
        //store user data in global var
        userData = {
          userName: resUserData.data.display_name,
          userId: resUserData.data.id
        }
        res.redirect('http://localhost:4200/playlists');
      }).catch(err => {
        console.log(err);
        console.log('User details could not be fetched.');
      });
    }).catch(err => {
      console.log(err);
      console.log('Access token could not be fetched.');
    });
  } else {
    console.log('Invalid code');
  }
});

app.get('/playlists/init', (req, res, next) => {
  res.json({
    tokenData: tokenData,
    userData: userData,
  });
});

app.get('/playlists/playlist', (req, res, next) => {
  //fetch playlists
  if(userData.userId && tokenData.accessToken) {
    axios({
      method: 'get',
      url: 'https://api.spotify.com/v1/users/' + userData.userId + '/playlists',
      headers: { 'Authorization': 'Bearer ' + tokenData.accessToken }
    }).then(trackData => {
      let playlists = trackData.data.items;
      playlists = playlists.map(elem => {
        return elem = {
          id: elem.id,
          name: elem.name,
          tracks: elem.tracks.total,
          image: elem.images[1].url
        }
      });
      res.json({
        playlistsData: playlists
      });
    }).catch(err => {
      console.log(err);
      console.log('Playlists could not be fetched.');
    });
  }
});

app.get('/playlists/playlist/:id', (req, res, next) => {
  //fetch single playlist tracks
  const playlistId = req.params.id;
  if(tokenData.accessToken) {
    axios({
      method: 'get',
      url: 'https://api.spotify.com/v1/playlists/' + playlistId,
      headers: { 'Authorization': 'Bearer ' + tokenData.accessToken }
    }).then(trackData => {
      let tracks = trackData.data.tracks.items;
      tracks = tracks.map(elem => {
        let durObj = new Date(elem.track.duration_ms);
        let mins = durObj.getUTCMinutes();
        let secs = durObj.getUTCSeconds();
        return elem = {
          name: elem.track.name,
          album: elem.track.album.name,
          artists: elem.track.artists.map(elem => elem.name),
          duration: mins.toString() + ':' + secs.toString().padStart(2, '0'),
          uri: elem.track.uri
        }
      });
      res.json({
        tracks: tracks
      });
    }).catch(err => {
      console.log(err);
      console.log('Tracks could not be fetched.');
    });
  }
});

// app.get('/playlists/playlist/track/:uri', (req, res, next) => {
//   const trackUri = req.params.uri;
//   if(tokenData.accessToken) {
//     axios({
//       method: 'get',
//       url: 'https://api.spotify.com/v1/me/player',
//       headers: { 'Authorization': 'Bearer ' + tokenData.accessToken }
//     }).then(res => {
//       console.log(res.device);
//     }).catch(err => {
//       console.log(err);
//     })
//     axios({
//       method: 'put',
//       url: 'https://api.spotify.com/v1/me/player/play',
//       headers: { 'Authorization': 'Bearer ' + tokenData.accessToken },
//       params: {
//         // device_id : deviceId,
//         context_uri: trackUri
//       }
//     }).then(res => {
//       console.log('Track playing');
//     }).catch(err => {
//       console.log(err.reason);
//     });
//   }
// });


module.exports = app;
