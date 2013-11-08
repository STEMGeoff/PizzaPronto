module.exports = {
	simpleRoute: function (req, res) {
    	res.writeHead(200, {"content-type" : "text/plain"});
    	res.end('Simple Route');
	}
};