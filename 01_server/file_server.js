var http = require('http');
var path = require('path');
var fs = require('fs');

var mimeTypes = {
  '.js' : 'text/javascript',
  '.html' : 'text/html',
  '.css' : 'text/css'
};

http.createServer(function(req, res){
  var lookup = path.basename(decodeURI(req.url)) || 'index.html';
  var file = 'content/' + lookup;
  fs.exists(file, function(exists){
    if(exists){
      fs.readFile(file, function(err, data){
        if(err){
          res.writeHead(500);
          res.end('internal server error!!');
          return;
        }
        var header = {'Content-Type': mimeTypes[path.extname(file)]};
        res.writeHead(header);
        res.end(data);
      });
      return;
    }
    res.writeHead(404);
    res.end('page not found');
  });

}).listen(30000);

