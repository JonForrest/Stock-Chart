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
  var fromDate=new Date(req.body.from+"+00:00");
  var toDate=new Date(req.body.to+"+00:00");
  console.log(fromDate);
  console.log(toDate);



  
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


//console.log("dates after filter"+);

  for(const dateandtime in responseData){
    var closingValue=responseData[dateandtime]['4. close'];
    dates.push(dateandtime);
    values.push(Number(closingValue));
  }
 
//console.log("dates before filter"+dates);
// var testdate=dates[0];
// console.log(testdate);
// console.log(typeof testdate);
// var testdateasdate=new Date(testdate+"+00:00");
// console.log(testdateasdate);


var selecteddatapoints=[];

dates.forEach(isolateTimeRange);
function isolateTimeRange(ittDate,ittindex){
  
  const morphedDate=new Date(ittDate+"+0000");
  if(morphedDate.getTime()>=fromDate.getTime()&&morphedDate.getTime()<=toDate){
    selecteddatapoints.push(ittindex);
    
  }

}
console.log(selecteddatapoints);

var selecteddates=[];
var selectedvalues=[];

selecteddatapoints.forEach(function (pointselected){
    selecteddates.push(dates[pointselected]);
    selectedvalues.push(values[pointselected]);
});

  
  }else if(timeSeries==="TIME_SERIES_DAILY"){}
  else if(timeSeries==="TIME_SERIES_WEEKLY"){}
  else if(timeSeries==="TIME_SERIES_MONTHLY"){}
  else{}
    
    try {
     selecteddates=selecteddates.reverse();
     selectedvalues=selectedvalues.reverse();
      res.render("index.ejs", {dates:selecteddates,values:selectedvalues});
    } catch (error) {
      console.error("Failed to make request:", error.message);

    }
  });

  app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
  });