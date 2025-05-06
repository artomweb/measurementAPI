const express = require("express");
const csv = require("csvtojson");
const cors = require("cors"); // Importing cors middleware
const app = express();
const port = 2046;

let jsonArrayObj;

// Use CORS middleware with configuration
app.use(
  cors({
    origin: "*", // Allow all origins, you can specify specific domains if needed
    methods: ["GET", "POST", "OPTIONS"], // Allowed methods
    allowedHeaders: ["Content-Type", "Authorization"], // Allowed headers
    credentials: true, // Allow credentials if needed
  })
);

// Load CSV file into jsonArrayObj when the server starts
csv()
  .fromFile("files/sheet.csv")
  .then((data) => {
    console.log(data);
    jsonArrayObj = data.map((obj) => ({
      measureName: obj.measureName,
      actualValue: parseFloat(obj.actualValue.replace(/,/g, ""), 10),
    }));
    console.log(jsonArrayObj);
    console.log("CSV data loaded.");
  })
  .catch((err) => {
    console.error("Error loading CSV file:", err);
  });

// Main route to handle requests with URL parameter
app.get("/measure/:measure", (req, res) => {
  const measure = req.params.measure;

  if (!measure) {
    return res.status(400).json({
      ERROR: "No measurement supplied!",
    });
  } else if (isNaN(measure)) {
    return res.status(400).json({
      ERROR: "Measurement supplied is not a number!",
    });
  }

  // Find the closest object
  const selectedObject = jsonArrayObj.reduce((a, b) =>
    Math.abs(b.actualValue - +measure) < Math.abs(a.actualValue - +measure)
      ? b
      : a
  );

  const allClosestObjects = jsonArrayObj.filter(
    (f) => f.actualValue === selectedObject.actualValue
  );
  const thisObject =
    allClosestObjects[Math.floor(Math.random() * allClosestObjects.length)];

  return res.status(200).json(thisObject);
});

// Start the server
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
