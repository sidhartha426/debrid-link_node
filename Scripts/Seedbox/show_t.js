const readline = require("readline");
const { data } = require("../data.js");
const download_t = require("./download_t.js");
const utils_t = require("./utils_t.js");
const { showFiles, showTorrents } = utils_t;
const utils = require("../utils.js");

const { cls, commands, procesCmd } = data;
const myoperations = [
  {
    message: "Manipulte Torrents  (default:disabled)",
    value: false,
  },
  {
    message: "Manipulte Files under Torrents  (default:disabled)",
    value: false,
  },
  {
    message: "Show file download URLS  (default:enabled)",
    value: true,
  },
  {
    message: "Set advanced Criterias  (default:disabled)",
    value: false,
  },
];

const dataScreen = (torrents, formats, keywords) => {
  const scanner = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });

  let currentScreenFunction, currentIndexs;

  const fprocessInput = async (input) => {
    if (currentScreenFunction === torrentScreen) {
      if (utils.checkRangeInput(input, torrents.length)) {
        currentIndexs = utils.fetchIndexes(input);
        filesScreen();
        currentScreenFunction = filesScreen;
      } else if (commands.includes(input)) {
        procesCmd(input, scanner, currentScreenFunction);
      } else {
        console.log("Wrong Input\n");
      }
    } else if (currentScreenFunction === filesScreen) {
      if (commands.includes(input)) {
        procesCmd(input, scanner, currentScreenFunction);
      } else if (input === "back" || input === "b") {
        procesCmd("r", scanner, torrentScreen);
        currentScreenFunction = torrentScreen;
      } else {
        console.log("Wrong Input\n");
      }
    }
  };

  const torrentScreen = () => {
    cls();
    showTorrents(torrents, formats, keywords);
    console.log(
      "\nCommmands =>\ne/exit: To exit\nr/reprint: To reprint current screen\n\n" +
        "Enter Torrent Number:"
    );
  };

  const filesScreen = () => {
    cls();
    showFiles(torrents, currentIndexs,myoperations[2].value);
    console.log(
      "\nCommmands =>\ne/exit: To exit\nr/reprint: To reprint current screen" +
        "\nb/back:To go back to torrents list \n\n" +
        "Enter Command:"
    );
  };

  utils.dataCheck(torrents, "No torrents available to your criteria");

  currentScreenFunction = torrentScreen;

  currentScreenFunction();

  scanner.on("line", (input) => {
    fprocessInput(input);
  });
};

const advOptionsScreen = (torrents) => {
  let formats, keywords;
  const myoperations = [
    {
      message: "Set relevent file formats (default:disabled)",
      value: false,
    },
    {
      message: "Manipulte Files under Torrents  (default:disabled)",
      value: false,
    },
  ];

  const processInput = async (operations) => {
    if (operations[0].value) {
      formats = await utils.passKeywords(
        "Message: Press Enter for defaults\n\n" +
          "Enter required file formats:",
        true
      );
    }
    if (operations[1].value) {
      keywords = await utils.passKeywords(
        "Message: Press Enter for defaults\n\n" +
          "Enter keywords to be excluded:",
        true
      );
    }
    dataScreen(torrents, formats, keywords);
  };
  const banner = "\tSet Advanced Options:\n\n";
  utils.dataCheck(torrents, "No torrents available");
  utils.execOperations(myoperations, processInput, false, banner);
};

const mainScreen = (torrents) => {
  const processInput = async (operations) => {
    if (operations[0].value) {
      torrents = await utils_t.manipulateTorrents(torrents);
    }
    if (operations[1].value) {
      torrents = await utils_t.manipulateTorrentFiles(torrents);
    }
    if (operations[3].value) {
      advOptionsScreen(torrents);
    } else {
      dataScreen(torrents);
    }
  };
  const banner = "\tShow Torrents:\n\n";
  utils.dataCheck(torrents, "No torrents available");
  utils.execOperations(myoperations, processInput, false, banner);
};

exports.mainScreen = mainScreen;
