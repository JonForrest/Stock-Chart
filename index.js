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

//#region experimental array generator
 


//const fs = require('fs');
// var datastartdate=new Date("2000-01");
// var dataenddate=new Date("")
// console.log();
// for(var n=0; n>=1;n++){

// }


// let data = "Learning how to write in a file."
// fs.writeFile('Output.txt', data, (err) => { 
//     if (err) throw err; 
// });

//#endregion 





  //#region assign user submitted data
  var dates=[];
  var values=[];
  var selecteddatapoints=[];
  var selecteddates=[];
  var selectedvalues=[];
  var whatchart=req.body.subFrom;
  console.log("success");
  console.log(req.body.from);
  var fromDate=new Date(req.body.from+"+00:00");
  var toDate=new Date(req.body.to+"+00:00");
  var symbol=req.body.textEntry;
  symbol=symbol.toUpperCase();
 
  console.log("success")
  console.log(fromDate);

  //#endregion 

  const response = await axios.get(`https://www.alphavantage.co/query?function=TIME_SERIES_INTRADAY&symbol=IBM&interval=5min&apikey=${mykey}`);
  var responseData= response.data['Time Series (5min)'];//rids response of metadata and isolates information imidiately useful

 

  for(const dateandtime in responseData){
    var closingValue=responseData[dateandtime]['4. close'];
    dates.push(dateandtime);
    values.push(Number(closingValue));
  }



dates.forEach(isolateTimeRange);
function isolateTimeRange(ittDate,ittindex){
  
  const morphedDate=new Date(ittDate+"+0000");
  if(morphedDate.getTime()>=fromDate.getTime()&&morphedDate.getTime()<=toDate){
    selecteddatapoints.push(ittindex);
    
  }

}
console.log(selecteddatapoints);



selecteddatapoints.forEach(function (pointselected){
    selecteddates.push(dates[pointselected]);
    selectedvalues.push(values[pointselected]);
});

  
 
    
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