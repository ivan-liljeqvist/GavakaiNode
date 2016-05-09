//basic initialization
var express = require('express');
var bodyParser = require('body-parser');
var app = express();

//init body parser
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

//gavagai stuff
var gavagai = require('gavagai');
var client = gavagai('1d3be6f17cb6d5c8ce2bc33a776d0120');

//read csv
var csv = require('fast-csv');
var fs = require('fs');
var stream = fs.createReadStream("example.csv");
 
//do stuff with gavagai
var jsonObject = {};
var csvStream = csv()
.on("data", function(data){
     console.log(data);
})
.on("end", function(){
    console.log("done");
})
.on('error', function(error) {
  	console.log("Catch an invalid csv file!!!");
});
 
stream.pipe(csvStream);




/*
var text = "Huma, As I mentioned to you both before, told me in our interview a couple of weeks ago that she was now B5 only interested in two jobs, both of which are out of reach: B6 and (name in play). And it's ok. "

client.tonality(text, function(err, data) {
	   
	    if (err) {
	       console.error('error:', err);
	    }
	    

	    console.log(JSON.stringify(data));
   });

*/

/*

var server = app.listen(8081, function () {

  var host = server.address().address
  var port = server.address().port

  console.log("Example app listening at http://%s:%s", host, port)

})*/