const fs = require("fs");
const csv=require('csvtojson')
const csvFilePath='cajeros-automaticos.csv'

csv()
.fromFile(csvFilePath)
.then((jsonObj)=>{
    let json = JSON.stringify(jsonObj);
    fs.writeFileSync('cajeros-automaticos.json', json);
})