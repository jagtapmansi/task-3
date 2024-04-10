const express = require("express");
const https = require("https"); //requiring https module
const app = express();
const bodyParser = require("body-parser");

app.use(bodyParser.urlencoded({extended : true}));
app.get('/', function(req, res){
    res.sendFile(__dirname+"/index.html");
    // res.send("server is running");  //sending response to main route
});

app.post('/', function(req, res){
    
    const appID = "d27a61a9da2f00fd10283fe4f959d9c3";
    const query = req.body.cityName;
    const unit = "metric";
    //url for fetching data from external server (openweather api)
    const url = "https://api.openweathermap.org/data/2.5/weather?appid="+appID+"&q="+query+"&units="+unit;

    https.get(url, function(response){  //getting response from url using https network
        console.log(response.statusCode);

        response.on("data", function(data){ //tapping into the data sent by response
            const weatherData = JSON.parse(data); //converting hexadec data into json & storing
            const temp = weatherData.main.temp; //getting value of specific object
            console.log(weatherData);

            const description = weatherData.weather[0].description;
            console.log(description);
            
            const icon = weatherData.weather[0].icon;
            const imgURL = "http://openweathermap.org/img/wn/"+ icon +"@2x.png";
            //we can have only one send method inside get method But multiple write methods can be used
            res.write("<h1>The temp in "+query+" is " + temp + " degrees.</h1>");
            res.write("<br><p>The weather description is "+description+".</p>");
            res.write("<img src = "+imgURL+">");
            res.send();
        });
    });
});

app.listen(3000, function(){
    console.log("Server is running on port 3000");
});