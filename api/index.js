let csv = require("csvtojson");

let jsonArrayObj;

csv()
    .fromFile("files/sheet.csv")
    .then(function(json) {
        jsonArrayObj = json;

        // console.log("closest object", selectedObject);
        // console.log("closest objects", allClosestObjects);
        // console.log("chosen object", thisObject);

        // let result = {
        //     measureName: thisObject["Measurement Name"],
        //     actualValue: thisObject["size/m"],
        // };

        // console.log(result);
    });

const allowCors = (fn) => async(req, res) => {
    res.setHeader("Access-Control-Allow-Credentials", true);
    res.setHeader("Access-Control-Allow-Origin", "*");
    // another common pattern
    // res.setHeader('Access-Control-Allow-Origin', req.headers.origin);
    res.setHeader("Access-Control-Allow-Methods", "GET,OPTIONS,PATCH,DELETE,POST,PUT");
    res.setHeader("Access-Control-Allow-Headers", "X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version");
    if (req.method === "OPTIONS") {
        res.status(200).end();
        return;
    }
    return await fn(req, res);
};

const handler = (req, res) => {
    if (!req.query.measure) {
        res.status(400).json({
            ERROR: "No measurement supplied!",
        });
    } else {
        json = json.map((obj) => {
            return { measureName: obj["Measurement Name"], actualValue: parseFloat(obj["size/m"].replace(/,/g, ""), 10) };
        });

        let selectedObject = jsonArrayObj.reduce((a, b) => {
            return Math.abs(b.actualValue - 1) < Math.abs(a.actualValue - 1) ? b : a;
        });

        let allClosestObjects = jsonArrayObj.filter((f) => {
            return f.actualValue == selectedObject.actualValue;
        });

        let thisObject = allClosestObjects[Math.floor(Math.random() * allClosestObjects.length)];

        res.status(200).json(thisObject);
    }
};

module.exports = allowCors(handler);