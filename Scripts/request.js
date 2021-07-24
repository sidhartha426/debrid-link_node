const https = require("https");
const { data } = require("./data.js");
const qs = require("querystring");

const makeReadRequest = async (method, path) => {
  const options = {
    method: method,
    hostname: data.hostname,
    path: path,
    headers: {
      Authorization: "Bearer " + data.accessToken,
    },
    maxRedirects: 20,
  };

  const request = new Promise((resolve, reject) => {
    let req = https.request(options, (res) => {
      var chunks = [];

      res.on("data", function (chunk) {
        chunks.push(chunk);
      });

      res.on("end", function (chunk) {
        var body = Buffer.concat(chunks);
        resolve(JSON.parse(body));
      });

      res.on("error", function (error) {
        reject(error);
      });
    });

    req.end();
  });

  return request;
};

const makeWriteRequest = async (method, path, dataObject) => {
  const options = {
    method: method,
    hostname: data.hostname,
    path: path,
    headers: {
      Authorization: "Bearer " + data.accessToken,
      "Content-Type": "application/x-www-form-urlencoded",
    },
    maxRedirects: 20,
  };

  const request = new Promise((resolve, reject) => {
    let req = https.request(options, (res) => {
      var chunks = [];

      res.on("data", function (chunk) {
        chunks.push(chunk);
      });

      res.on("end", function (chunk) {
        var body = Buffer.concat(chunks);
        resolve(JSON.parse(body));
      });

      res.on("error", function (error) {
        reject(error);
      });
    });

    req.write(qs.stringify(dataObject));

    req.end();
  });

  return request;
};

exports.makeWriteRequest = makeWriteRequest;
exports.makeReadRequest = makeReadRequest;
