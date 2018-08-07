'use strict';

let express = require('express');
let env = require('../../config/env.json');

const app = express();
let ready = false;

app.listen(env.server.port, () => {
  ready = true;
  console.log('Listening on port ' + env.server.port);
});

app.all('*', (req, res, next) => {
  if (!ready) {
    return res.status(503).json({success: false, message: 'Server is not ready yet', data: {}});
  }
  next();
});

app.get('*', (req, res, next) => {
  let path = req.path;

  if (path.indexOf('/api') === 0) { // Don't try to find a file if an API was requested
    next();
  } else {
    // If there are no more forward slashes after a period,
    // then let's try to find a file
    if (path.lastIndexOf('.') > path.lastIndexOf('/')) {
      let options = {
        root: '../../client',
        headers: {
          'contentType': getMimeTypeForFile(path)
        }
      };

      res.sendFile(path, options, (err) => {
        if (err) {
          let message = 'Could not find ' + path;
          console.error(message);
          return res.status(404).json({success: false, message, data: {}}).end();
        }
      })
    } else { // Any other path, send index.html and let React Router sort it out
      let options = {
        root: '../../client/src',
        headers: {
          'contentType': 'text/html'
        }
      };
      res.sendFile('index.html', options, (err) => {
        if (err) {
          let message = 'index.html is missing, make sure the file exists, that Node has proper permissions, and that the root path in app.get(*) is correct';
          console.error(message);
          return res.status(500).json({success: false, message, data: {}}).end();
        }
      })
    }
  }
});

// TODO: Create a favicon
app.get('/favicon.ico', (req, res) => {
  console.log('Favicon not implemented');
  return res.status(501).end('Favicon not implemented');
});

function getMimeTypeForFile(path) {
  let extension = path.substring(path.lastIndexOf('.') + 1, path.length).toLowerCase();
  switch (extension) {
    case 'css':
      return 'text/css';
      break;
    case 'gif':
      return 'image/gif';
    case 'ico':
      return 'image/x-icon';
    case 'htm':
    case 'html':
      return 'text/html';
    case 'js':
      return 'text/javascript';
    case 'jpg':
    case 'jpeg':
      return 'image/jpeg';
    case 'png':
      return 'image/png';
    case 'xml':
      return 'application/xml';
    default:
      return 'text/plain';
  }
}
