const { data } = require("../data.js");

const showFiles = (receivedFiles) => {

  receivedFiles.forEach((file, index) => {
    console.log(index + 1, file.name, "\n");
    console.log("URL: " + file.downloadUrl + "\n\n");
  });

};

exports.showFiles=showFiles;
