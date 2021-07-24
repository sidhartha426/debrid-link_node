const readline = require("readline");
const { data } = require("../data.js");
const utils_d = require("./utils_d.js");
const utils = require("../utils.js");

const { cls, commands, procesCmd } = data;
//Show all files list

const mainScreen = (filesInfo) => {
  const scanner = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });

  const currentScreen = () => {
    cls();
    utils_d.showFiles(filesInfo.value);
    console.log(
      "\nCommmands =>\ne/exit: To exit\nr/reprint: To reprint current screen\n\n" +
        "Enter Command:"
    );
  };

  utils.dataCheck(filesInfo, currentScreen, "No files available");

  scanner.on("line", (input) => {
    if (commands.includes(input)) {
      procesCmd(input, scanner, currentScreen);
    } else {
      console.log("Wrong Input\n");
    }
  });
};

exports.mainScreen = mainScreen;
