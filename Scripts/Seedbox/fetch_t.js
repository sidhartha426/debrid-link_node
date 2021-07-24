const { data } = require("../data.js");
const myrequest = require("../request.js");

const fetch = async () => {
  const requiredData = await myrequest
    .makeReadRequest("GET", data.path_add_t)
    .then((receivedData) => receivedData)
    .catch((err) => err);
  return requiredData;
};

exports.fetch = fetch;
