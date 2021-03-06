var fs = require('fs'),
  path = require('path'),
  ejs = require('ejs'),
  exec = require('child_process').exec,
  express = require('express');

exec('find cats -type f').stdout.on('data', function (files) {
  var cats = files.split("\n");
  var app = express();

  app.set('views', __dirname + '/views');
  app.engine('html', ejs.renderFile);

  app.get('/netcat', function(req, res){
    res.render('netcat.html');
  });
  
  app.get('/auto', function(req, res){
    res.render('auto.html');
  });
  
  app.get('/all', function(req, res){
    res.writeHead(200, {'Content-Type':'text/html'});
    res.write('<html>');
    for (var i = 0; i < cats.length; i++) {
      res.write('<a href="/' + cats[i] + '" target="_blank">' + cats[i] + '</a></br>\n');
    }
    res.write('</html>');
    res.end();
  });

  app.get('/all/show', function(req, res){
    res.writeHead(200, {'Content-Type':'text/html'});
    res.write('<html>');
    for (var i = 0; i < cats.length; i++) {
      res.write('<img src="/' + cats[i] + '" alt="cat gifs!"/>\n');
    }
    res.write('</html>');
    res.end();
  });

  app.get('/all/count', function(req, res){
    res.send('There are ' + cats.length + ' total edgecat gifs');
  });

  app.get('/netcat/:image', function(req, res){
    fs.readFile('views/' + req.params.image, function ( err, img ) {
      res.writeHead(200, {'Content-Type':'image/png'});
      res.end(img, 'binary');
    });
  });
  
  app.get('/cats/:cat', function(req, res){
    if (fs.existsSync('cats/' + req.params.cat)) {
      fs.readFile('cats/' + req.params.cat, function ( err, img ) {
        if (img.length) {
	  res.writeHead(200, {
			'Content-Type':'image/gif',
			'Access-Control-Allow-Origin':'*',
			'Content-Length':img.length,
	  });
	} else {
	  res.writeHead(200, {
			'Content-Type':'image/gif',
			'Access-Control-Allow-Origin':'*',
	  });
	}
        res.end(img, 'binary');
      });
    }
    else {
      res.redirect('/');
    }
  });

  app.get('*', function(req, res){
    var cat = cats[Math.floor(Math.random()*cats.length)];  
    if (req.url == '/random') {
      res.send('http://' + req.header('host') + '/' + cat);
    }
    else {
      fs.readFile(cat, function ( err, img ) {
	if (img.length) {
	  res.writeHead(200, {
			'Content-Type':'image/gif',
			'Access-Control-Allow-Origin':'*',
			'Content-Length':img.length,
			'X-Cat-Link':'/' + cat,
	  });
	} else {
	  res.writeHead(200, {
			'Content-Type':'image/gif',
			'Access-Control-Allow-Origin':'*',
			'X-Cat-Link':'/' + cat,
	  });
	}
        res.end(img, 'binary');
      });
    }
  });

  app.listen();
});

