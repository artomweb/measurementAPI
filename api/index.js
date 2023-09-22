let csv = require("csvtojson");

function getData() {
  return new Promise((resolve, reject) => {
    csv()
      .fromFile("files/sheet.csv")
      .then(function (data) {
        // Map the raw CSV data into a more structured format.
        data = data.map((obj) => {
          return {
            measureName: obj.measureName,
            actualValue: parseFloat(obj.actualValue.replace(/,/g, ""), 10), // Parse and format the "size/m" field as a float.
          };
        });

        resolve(data);
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
  try {
    if (!req.query.measure) {
      // Check if 'measure' is missing in the query parameters.
      res.status(400).json({
        ERROR: "No measurement supplied!",
      });
    } else if (isNaN(req.query.measure)) {
      // Check if 'measure' is not a valid number.
      res.status(400).json({
        ERROR: "Measurement supplied is not a number!",
      });
    } else {
      // Parse the csv data
      const csvData = await getData();

      // Find the closest object in 'csvData' based on the absolute difference from 'measure'.
      let selectedObject = csvData.reduce((a, b) =>
        Math.abs(b.actualValue - +req.query.measure) <
        Math.abs(a.actualValue - +req.query.measure)
          ? b
          : a
      );

      // Filter objects with the same 'actualValue' as the 'selectedObject'.
      let allClosestObjects = csvData.filter(
        (f) => f.actualValue == selectedObject.actualValue
      );

      // Randomly select one object from 'allClosestObjects'.
      let thisObject =
        allClosestObjects[Math.floor(Math.random() * allClosestObjects.length)];

      res.status(200).json(thisObject);
    }
  } catch (error) {
    console.error("Internal Server Error:", error);

    res.status(500).json({
      ERROR: "Internal Server Error",
    });
  }
};

module.exports = allowCors(handler);
