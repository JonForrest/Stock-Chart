import express from "express";
import axios from "axios";
import bodyParser from "body-parser";
import { config } from "./config.js";

const app = express();
const port = 3000;

app.use(express.static("public"));
app.use(bodyParser.urlencoded({ extended: true }));

var mykey = config.MY_KEY;

app.get("/", async (req, res) => {

  var timeSeries="TIME_SERIES_INTRADAY";//will need to be changed for option chosen
  //var symbol=;
  //var interval=;

  

  if(timeSeries==="TIME_SERIES_INTRADAY"){
  const response = await axios.get(`https://www.alphavantage.co/query?function=TIME_SERIES_INTRADAY&symbol=IBM&interval=5min&apikey=${mykey}`);
  var responseData= response.data['Time Series (5min)'];//rids response of metadata and isolates information imidiately useful

  //Generates Array for Intraday time and closing trade value
  var dataPoints=[]
  for(const x in responseData){
    var closingValue=responseData[x]['4. close'];
    dataPoints.push([x,closingValue]);
  }
  console.log(dataPoints);
  console.log("done");
  }else if(timeSeries===TIME_SERIES_DAILY){}
  else if(timeSeries===TIME_SERIES_WEEKLY){}
  else if(timeSeries===TIME_SERIES_MONTHLY){}
    
    try {
      
      res.render("index.ejs", {});
    } catch (error) {
      console.error("Failed to make request:", error.message);

    }
  });

  app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
  });