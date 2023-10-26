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
  //#region assign user submitted data
  var dates = [];
  var values = [];
  var selecteddatapoints = [];
  var selecteddates = [];
  var selectedvalues = [];
  var whatchart = req.body.subFrom;
  console.log("'From' from request body:" + req.body.from);
  var fromDate = new Date(req.body.from + "+0000");
  var toDate = new Date(req.body.to + "+0000");
  var symbol = req.body.textEntry;
  symbol = symbol.toUpperCase();
  console.log(fromDate);
  var startYear=fromDate.getFullYear();
  var startMonth=fromDate.getMonth();
  var endYear=toDate.getFullYear();
  var endMonth=toDate.getMonth();
  console.log(startYear);
  console.log(startMonth);
  

  //#endregion

  //#region call API
  const response = await axios.get(
    `https://www.alphavantage.co/query?function=TIME_SERIES_INTRADAY&symbol=IBM&interval=5min&apikey=${mykey}`
  );
  var responseData = response.data["Time Series (5min)"]; //rids response of metadata and isolates information imidiately useful
  console.log(responseData);
  //#endregion

  //#region populate dates and values arrays
  for (const dateandtime in responseData) {
    var closingValue = responseData[dateandtime]["4. close"];
    dates.push(dateandtime);
    values.push(Number(closingValue));
  }
  //#endregion

  //#region populate array full of index values for selected data points
  dates.forEach(isolateTimeRange);
  function isolateTimeRange(ittDate, ittindex) {
    const morphedDate = new Date(ittDate + "+0000");
    if (
      morphedDate.getTime() >= fromDate.getTime() &&
      morphedDate.getTime() <= toDate
    ) {
      selecteddatapoints.push(ittindex);
    }
  }
  //#endregion

  //#region populate two new arrays (for dates and values) with only selected data points
  selecteddatapoints.forEach(function (pointselected) {
    selecteddates.push(dates[pointselected]);
    selectedvalues.push(values[pointselected]);
  });
  //#endregion



  try {
    selecteddates = selecteddates.reverse();
    selectedvalues = selectedvalues.reverse();
    res.render("index.ejs", { dates: selecteddates, values: selectedvalues });
  } catch (error) {
    console.error("Failed to make request:", error.message);
  }
});



app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
