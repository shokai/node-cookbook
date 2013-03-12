var http = require('http');
var path = require('path');
var fs = require('fs');

var mimeTypes = {
  '.js' : 'text/javascript',
  '.html' : 'text/html',
  '.css' : 'text/css'
};

var cache = {};


http.createServer(function(req, res){
  var lookup = path.basename(decodeURI(req.url)) || 'index.html';
  var file = 'content/' + lookup;
  fs.exists(file, function(exists){
    if(exists){
      var header = {'Content-Type': mimeTypes[path.extname(file)]};
      if(cache[file]){
        console.log('cache hit - '+file);
        res.writeHead(200, header);
        res.end(cache[file].content);
        return;
      }
      var s = fs.createReadStream(file, {bufferSize: 128*1024}); // 128KB
      s.once('open', function(){
        res.writeHead(200, header);
        this.pipe(res);
      });
      s.once('error', function(err){
        console.err(err);
        res.writeHead(500);
        res.end('internal server error!!');
      });
      fs.stat(file, function(err, stat){
        var bufferOffset = 0;
        cache[file] = {content: new Buffer(stat.size)};
        s.on('data', function(data){
          data.copy(cache[file].content, bufferOffset);
          bufferOffset += data.length;
        });
      });
      return;
    }
    res.writeHead(404);
    res.end('page not found');
  });

}).listen(30000);

