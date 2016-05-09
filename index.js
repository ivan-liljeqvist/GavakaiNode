//basic initialization
var express = require('express');
var bodyParser = require('body-parser');
var app = express();
var sleep = require('sleep');

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
var csvStream = csv();
var firstRow=true;

var rows=[]; //rows from CSV as an array, each element is also an array
var rowsWithSentiment=[]; //like rows but filled with sentiment from Gavagai


var counter=0;
var numToBeCompleted=0;

function addSentimentToRows(hundredRows,chunkNum,chunkSize){

    var wait=Math.random()*1000;

    setTimeout(function(){



        try{

          client.tonality(hundredRows, function(err, data) {
       
            if (err) {
               console.error('retry!! error:', err);
               
            }
            else{
          
              numToBeCompleted--;
              console.log("completed! chunkNum: "+chunkNum+" chunks left: "+numToBeCompleted);
              
              data.texts.forEach(function(text){

                var indexInRowsArray = parseInt(text.id)+(chunkNum-1)*chunkSize;
                rows[indexInRowsArray][4]=text.tonality[0].normalizedScore; //scepticism
                rows[indexInRowsArray][5]=text.tonality[1].normalizedScore; //love
                rows[indexInRowsArray][6]=text.tonality[2].normalizedScore; //negativity
                rows[indexInRowsArray][7]=text.tonality[3].normalizedScore; //fear
                rows[indexInRowsArray][8]=text.tonality[4].normalizedScore; //desire
                rows[indexInRowsArray][9]=text.tonality[5].normalizedScore; //positivity
                rows[indexInRowsArray][10]=text.tonality[6].normalizedScore; //hate
                rows[indexInRowsArray][11]=text.tonality[7].normalizedScore; //violence


              });

              if(numToBeCompleted<=0){
                console.log("DONE!!")
              }

            }

          });

        }
        catch(e){
          console.error('retry!! error:', e);
       
        }
        

    },wait);
  
};

// go through the csv file and put each row in the array
csvStream.on("data", function(data){

    if(firstRow){
      firstRow=false;
    }
    else{
      
      data[3]=data[3].replace(/[^\w\s!?,\.]/g,'') //remove all strange chars, gavagai cant handle emojis and such
      rows[counter]=data;
      counter++;
    }

    
     
})
.on("end", function(){ 


    //now we have all info in the array, go through the array and get the tonality
    var i,j,temparray,chunk = 800,chunkIter=1;
    for (i=0,j=rows.length; i<j; i+=chunk) {

        temparray = rows.slice(i,i+chunk);

        var textsToAnalyze=[];
        temparray.forEach(function(row){
            textsToAnalyze.push(row[3]);
        });

        numToBeCompleted++;
        addSentimentToRows(textsToAnalyze,chunkIter,chunk);

        chunkIter++;
        
    }

    

    

})
.on('error', function(error) {
  	console.log("Catch an invalid csv file!!!");
});
 
stream.pipe(csvStream);


process.on('uncaughtException', function (err) {
  console.log('Caught exception: ' + err);
});

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