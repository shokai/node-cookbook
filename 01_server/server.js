var http = require('http');
var url = require('url');

var pages = [
  {route: '/', output: 'zanmai'},
  {route: '/about/this', output: 'sample server app'},
  {route: '/about/node', output: 'EventIO for V8 engine'},
  {route: '/another page', output: function(){ return 'this is ' + this.route; }}
];

http.createServer(function(req, res){
  var u = url.parse(decodeURI(req.url), true);
  pages.forEach(function(page){
    if(page.route === u.pathname){
      res.writeHead(200, {'Content-Type': 'text/html'});
      res.end(typeof page.output === 'function' ? page.output() : page.output);
    }
  });
  if(!res.finished){
    res.writeHead(404);
    res.end('404 page not found');
  }
}).listen(30000);

