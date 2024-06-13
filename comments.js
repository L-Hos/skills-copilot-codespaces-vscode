// Create web server
var http = require('http');
var fs = require('fs');
var path = require('path');
var url = require('url');
var comments = require('./comments');
var querystring = require('querystring');

var server = http.createServer(function(req, res) {
  var pathname = url.parse(req.url).pathname;
  if(pathname === '/'){
    fs.readFile('./index.html', function(err, data) {
      if(err) {
        console.log(err);
        return;
      }
      res.writeHead(200, {'Content-Type': 'text/html'});
      res.write(data.toString());
      res.end();
    });
  }else if(pathname === '/comments'){
    if(req.method === 'POST'){
      var postData = '';
      req.on('data', function(chunk) {
        postData += chunk;
      });
      req.on('end', function() {
        var comment = querystring.parse(postData).comment;
        comments.add(comment);
        res.end();
      });
    }else if(req.method === 'GET'){
      res.writeHead(200, {'Content-Type': 'application/json'});
      res.write(JSON.stringify(comments.get()));
      res.end();
    }
  }else{
    var extname = path.extname(pathname);
    var contentType = 'text/plain';
    switch(extname){
      case '.html':
        contentType = 'text/html';
        break;
      case '.js':
        contentType = 'text/javascript';
        break;
      case '.css':
        contentType = 'text/css';
        break;
      case '.jpg':
        contentType = 'image/jpeg';
        break;
    }
    fs.readFile('.' + pathname, function(err, data) {
      if(err) {
        console.log(err);
        return;
      }
      res.writeHead(200, {'Content-Type': contentType});
      res.write(data.toString());
      res.end();
    });
  }
});

server.listen(3000, function() {
  console.log('Server is running at http://localhost:3000/');
});