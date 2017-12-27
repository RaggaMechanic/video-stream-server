var app = require("express");
var http = require("http");
var fs = require("fs");


http.createServer(function (req, res) {
	var path = ['small.mp4','mov_bbb.mp4'];
	var stat = fs.statSync(path[0]);
	var total = stat.size;
	
	if (req.headers['range']) {
		
		var range = req.headers.range;
		
		var parts = range.replace(/bytes=/, "").split("-");
		
		var partialstart = parts[0];
		var partialend = parts[1];

		var start = parseInt(partialstart, 10);
		var end = partialend ? parseInt(partialend, 10) : total-1;
		var chunksize = (end-start)+1;
	
		console.log('RANGE: ' + start + ' - ' + end + ' = ' + chunksize);

		var file = fs.createReadStream(path[0], {start: start, end: end});
			res.writeHead(206, 
				{	'Content-Range': 'bytes ' + start + '-' + end + '/' + total, 
					'Accept-Ranges': 'bytes', 'Content-Length': chunksize, 'Content-Type': 'video/mp4' });
			file.pipe(res);
			
	} else {
		
		console.log('ALL: ' + total);
		res.writeHead(200, { 'Content-Length': total, 'Content-Type': 'video/mp4' });
		fs.createReadStream(path[0]).pipe(res);
	}
	
}).listen(8055);

console.log('stream server run at 127.0.0.1:8055');