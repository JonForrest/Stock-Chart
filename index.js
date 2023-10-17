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


  try {
      
    res.render("index.ejs", {});
  } catch (error) {
    console.error("Failed to make request:", error.message);

  }

});


app.post("/", async (req, res) => {

  console.log(req.body);



  
  var timeSeries="TIME_SERIES_INTRADAY";
  //var symbol=;
  //var outputsize=;
  //var interval=;
  //var month=;

  

  if(timeSeries==="TIME_SERIES_INTRADAY"){
  const response = await axios.get(`https://www.alphavantage.co/query?function=TIME_SERIES_INTRADAY&symbol=IBM&interval=5min&apikey=${mykey}`);
  var responseData= response.data['Time Series (5min)'];//rids response of metadata and isolates information imidiately useful

  //Generates Array for Intraday time and closing trade value
  var dates=[];
  var values=[];
  for(const dateandtime in responseData){
    var closingValue=responseData[dateandtime]['4. close'];
    dates.push(dateandtime);
    values.push(Number(closingValue));
  }
  console.log(dates);
  console.log(values);

  console.log("done");
  }else if(timeSeries==="TIME_SERIES_DAILY"){}
  else if(timeSeries==="TIME_SERIES_WEEKLY"){}
  else if(timeSeries==="TIME_SERIES_MONTHLY"){}
  else{}
    
    try {
      
      res.render("index.ejs", {dates:dates,values:values});
    } catch (error) {
      console.error("Failed to make request:", error.message);

    }
  });

  app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
  });