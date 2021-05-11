const csv = require("csvtojson");

function getMeasurement(dist) {
    csv()
        .fromFile("files/sheet.csv")
        .then((jsonObj) => {
            let selectedUnit = jsonObj.sort(
                (a, b) =>
                Math.abs(parseInt(a["size/m"]) - req.query.measure) -
                Math.abs(parseInt(b["size/m"]) - req.query.measure)
            )[0];
            return selectedUnit;
        })
        .catch((err) => {
            return { ERROR: "no csv" + err };
        });
}

// module.exports = (req, res) => {
//     if (!req.query.measure) {
//         return res.json({ body: { ERROR: "No measurement supplied" } });
//     } else {
//         return res.json({ body: getMeasurement(parseInt(req.query.measure)) });
//     }

//     // res.json({ body: "HELLO" });
// };

const allowCors = (fn) => async(req, res) => {
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

const handler = (req, res) => {
    if (!req.query.measure) {
        res.json({
            ERROR: "No measurement supplied",
        });
    } else {
        csv()
            .fromFile("files/sheet.csv")
            .then((jsonObj) => {
                let selectedUnit = jsonObj.sort(
                    (a, b) =>
                    Math.abs(parseInt(a["size/m"]) - req.query.measure) -
                    Math.abs(parseInt(b["size/m"]) - req.query.measure)
                )[0];
                res.json(selectedUnit);
            })
            .catch((err) => {
                // return { ERROR: "no csv" + err };
                res.json({ ERROR: "no csv" + err });
            });
    }
};

module.exports = allowCors(handler);