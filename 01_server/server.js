var http = require('http');
var path = require('path');

var pages = [
  {route: '', output: 'zanmai'},
  {route: 'about', output: 'sample server app'},
  {route: 'another page', output: function(){ return 'this is ' + this.route; }}
];

http.createServer(function(req, res){
  var lookup = path.basename(decodeURI(req.url));
  pages.forEach(function(page){
    if(page.route === lookup){
      res.writeHead(200, {'Content-Type': 'text/html'});
      res.end(typeof page.output === 'function' ? page.output() : page.output);
    }
  });
  if(!res.finished){
    res.writeHead(404);
    res.end('404 page not found');
  }
}).listen(30000);

