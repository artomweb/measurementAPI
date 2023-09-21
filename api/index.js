let csv = require("csvtojson");
import { kv } from "@vercel/kv";

let gloablcsvData; // Global variable to store CSV data

function getData() {
  return new Promise((resolve, reject) => {
    csv()
      .fromFile("files/sheet.csv")
      .then(function (data) {
        data = data.map((obj) => {
          return {
            measureName: obj["Measurement Name"],
            actualValue: parseFloat(obj["size/m"].replace(/,/g, ""), 10),
          };
        });
        let csvdata = data.slice(); // Store the data globally
        console.log("Read jsonArray");

        resolve(csvdata); // Resolve the promise with the data
      })
      .catch((err) => {
        reject(err); // Reject the promise if there's an error
      });
  });
}

const allowCors = (fn) => async (req, res) => {
  res.setHeader("Access-Control-Allow-Credentials", true);
  res.setHeader("Access-Control-Allow-Origin", "*");
  // another common pattern
  // res.setHeader('Access-Control-Allow-Origin', req.headers.origin);
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET,OPTIONS,PATCH,DELETE,POST,PUT"
  );
  res.setHeader(
    "Access-Control-Allow-Headers",
    "X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version"
  );
  if (req.method === "OPTIONS") {
    res.status(200).end();
    return;
  }
  return await fn(req, res);
};

const handler = async (req, res) => {
  if (!req.query.measure) {
    res.status(400).json({
      ERROR: "No measurement supplied!",
    });
  } else if (isNaN(req.query.measure)) {
    res.status(400).json({
      ERROR: "Measurement supplied is not a number!",
    });
  } else {
    const csvData = await getData();
    // console.log("csvData", csvData);
    let selectedObject = csvData.reduce((a, b) => {
      return Math.abs(b.actualValue - +req.query.measure) <
        Math.abs(a.actualValue - +req.query.measure)
        ? b
        : a;
    });

    let allClosestObjects = csvData.filter((f) => {
      return f.actualValue == selectedObject.actualValue;
    });

    let thisObject =
      allClosestObjects[Math.floor(Math.random() * allClosestObjects.length)];

    res.status(200).json(thisObject);
  }
};

module.exports = allowCors(handler);
