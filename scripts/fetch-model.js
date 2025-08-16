const fs = require('fs');
const path = require('path');
const https = require('https');

var download = function (url, dest, cb) {
    console.log(`Fetch: ${url} -> ${dest}`);
    var file = fs.createWriteStream(dest);
    https.get(url, function (response) {
        response.pipe(file);
        file.on('finish', function () {
            file.close(cb);
        });
    });
}

const dataPath = path.resolve(path.join(__dirname, '..', 'data'));
fs.mkdirSync(dataPath, { recursive: true });
const MODEL_URL = "https://data.opensanctions.org/meta/model.json";

download(MODEL_URL, path.join(dataPath, 'model.json'), function () { });
