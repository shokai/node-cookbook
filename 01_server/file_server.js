var http = require('http');
var path = require('path');
var fs = require('fs');

var mimeTypes = {
  '.js' : 'text/javascript',
  '.html' : 'text/html',
  '.css' : 'text/css'
};

var cache = {};
var cacheAndDeliver = function(fname, callback){
  if(cache[fname]){
    console.log('cache hit : ' + fname);
    fs.stat(fname, function(err, stat){
      var update_at = Date.parse(stat.ctime);
      if(update_at > cache[fname].timestamp){
        console.log('reload file' + fname);
        fs.readFile(fname, function(err, data){
          if(!err) cache[fname] = {content: data, timestamp: update_at};
          callback(err, data);
        });
        return;
      }
      callback(err, cache[fname].content);
    });
    return;
  }
  fs.readFile(fname, function(err, data){
    if(!err) cache[fname] = {content: data, timestamp: Date.now()};
    callback(err, data);
  });
};

http.createServer(function(req, res){
  var lookup = path.basename(decodeURI(req.url)) || 'index.html';
  var file = 'content/' + lookup;
  fs.exists(file, function(exists){
    if(exists){
      cacheAndDeliver(file, function(err, data){
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

