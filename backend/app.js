const express = require('express');
const bodyParser = require('body-parser');
const querystring = require('query-string');
const cors = require('cors');
const { combineLatest } = require('rxjs');
const axios = require('axios').default;
const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));

const clientId = 'ADD SPOTIFY CLIENT ID';
const clientSecret = 'ADD CLIENT SECRET';
const redirectUri = 'ADD REDIRECT PATH';

const scope = `user-follow-read
               user-read-recently-played
               user-library-read
               user-read-playback-state
               user-library-modify
               user-read-currently-playing
               user-modify-playback-state
               playlist-modify-public
               playlist-modify-private
               streaming
               user-read-email
               user-read-private`;

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
    accessToken: tokenData.accessToken,
    expiresIn: tokenData.expiresIn,
    userName: userData.userName,
    userId: userData.userId
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
            image: elem.images[0].url
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
          id: elem.track.id,
          name: elem.track.name,
          album: elem.track.album.name,
          artists: elem.track.artists.map(elem => elem.name),
          duration: mins.toString() + ':' + secs.toString().padStart(2, '0'),
          uri: elem.track.uri,
          image: elem.track.album.images[1].url
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

app.post('/playlists/playlist/new', (req, res, next) => {
  const playlistName = req.body.name;
  if(userData.userId && tokenData.accessToken) {
    axios({
      method: 'post',
      url: 'https://api.spotify.com/v1/users/' + userData.userId + '/playlists',
      headers: { 'Authorization': 'Bearer ' + tokenData.accessToken, 'Content-Type': 'application/json' },
      data: {
        name: playlistName
      }
    }).then(resData => {
      // console.log(resData.data.id);
      res.json({
        playlistId: resData.data.id
      });
    }).catch(err => {
      console.log(err);
      console.log('Playlist could not be created.');
    });
  }
})

app.post('/playlists/playlist/:id', (req, res, next) => {
  const playlistId = req.params.id;
  const trackUri = req.body.trackUri;
  axios({
    method: 'post',
    url: 'https://api.spotify.com/v1/playlists/' + playlistId + '/tracks',
    headers: { 'Authorization': 'Bearer ' + tokenData.accessToken },
    params: {
      uris: trackUri
    }
  }).then(resData => {
    res.status(200).send({
      message: 'Track added.'
    });
  }).catch(err => {
    console.log(err);
    console.log('Track could not be added.');
  });
});

app.delete('/playlists/playlist/:id/:uri', (req, res, next) => {
  const playlistId = req.params.id;
  const trackUri = req.params.uri;
  axios({
    method: 'delete',
    url: 'https://api.spotify.com/v1/playlists/' + playlistId + '/tracks',
    headers: { 'Authorization': 'Bearer ' + tokenData.accessToken, 'Content-Type': 'application/json' },
    data: {
      tracks: [{uri: trackUri}]
    }
  }).then(resData => {
    res.status(200).send({
      message: 'Track deleted.'
    })
  }).catch(err => {
    console.log(err);
  });
});

app.put('/playlists/playlist/track', (req, res, next) => {
  const deviceId = req.body.deviceId;
  const trackUri = req.body.uri;
  axios({
    method: 'put',
    url: 'https://api.spotify.com/v1/me/player/play',
    headers: { 'Authorization': 'Bearer ' + tokenData.accessToken },
    params: {
      device_id: deviceId
    },
    data: {
      uris: [trackUri]
    }
  }).then(resData => {
    console.log('Track playing.');
  }).catch(err => {
    console.log(err);
  });
});

app.put('/playlists/playlist/track/pause', (req, res, next) => {
  const deviceId = req.body.deviceId;
  axios({
    method: 'put',
    url: 'https://api.spotify.com/v1/me/player/pause',
    headers: { 'Authorization': 'Bearer ' + tokenData.accessToken },
    params: {
      device_id: deviceId
    }
  }).then(resData => {
    console.log('Track paused.');
  }).catch(err => {
    console.log(err);
  });
});

app.put('/playlists/playlist/track/resume', (req, res, next) => {
  const deviceId = req.body.deviceId;
  axios({
    method: 'put',
    url: 'https://api.spotify.com/v1/me/player/play',
    headers: { 'Authorization': 'Bearer ' + tokenData.accessToken },
    params: {
      device_id: deviceId
    }
  }).then(resData => {
    console.log('Track resumed.');
  }).catch(err => {
    console.log(err);
  });
});

app.get('/search/album/:id', (req, res, next) => {
  const albumId = req.params.id;
  if(tokenData.accessToken) {
    axios({
      method: 'get',
      url: 'https://api.spotify.com/v1/albums/' + albumId + '/tracks',
      headers: { 'Authorization': 'Bearer ' + tokenData.accessToken }
    }).then(resData => {
      let tracks = resData.data.items;
      tracks = tracks.map(elem => {
        let durObj = new Date(elem.duration_ms);
        let mins = durObj.getUTCMinutes();
        let secs = durObj.getUTCSeconds();
        return elem = {
          name: elem.name,
          id: elem.id,
          uri: elem.uri,
          duration: mins.toString() + ':' + secs.toString().padStart(2, '0')
        }
      });
      res.json({
        tracks: tracks
      });
    }).catch(err => {
      console.log(err);
    });
  }
});

app.get('/search/:query', (req, res, next) => {
  const query = req.params.query;
  if(tokenData.accessToken) {
    axios({
      method: 'get',
      url: 'https://api.spotify.com/v1/search',
      headers: { 'Authorization': 'Bearer ' + tokenData.accessToken },
      params: {
        q: query,
        type: 'track,album',
        limit: 20,
        market: 'US'
      }
    }).then(queryData => {
      let tracks = queryData.data.tracks.items;
      tracks = tracks.map(elem => {
        let durObj = new Date(elem.duration_ms);
        let mins = durObj.getUTCMinutes();
        let secs = durObj.getUTCSeconds();
        return elem = {
          id: elem.id,
          name: elem.name,
          album: elem.album.name,
          artists: elem.artists.map(elem => elem.name),
          duration: mins.toString() + ':' + secs.toString().padStart(2, '0'),
          uri: elem.uri,
        }
      });
      let albums = queryData.data.albums.items;
      albums = albums.map(elem => {
        return albums = {
          name: elem.name,
          id: elem.id,
          uri: elem.uri,
          artists: elem.artists.map(elem => elem.name),
          image: elem.images[1].url,
          date: elem.release_date.slice(0,4)
        }
      })
      res.json({
        queryTracks: tracks,
        queryAlbums: albums
      });
    }).catch(err => {
      console.log(err);
      console.log('Search failed.');
    });
  }
});




module.exports = app;
