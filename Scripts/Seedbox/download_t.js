const utils_t = require("./utils_t.js");
const utils = require("../utils.js");
const { data } = require("../data.js");
const { cls, commands, procesCmd } = data;

//flow of operations
//idea torrentsInfo  => torrents  => results  => outputFiles

//Used to make result File

const makeResult = (torrents) => {
  const results = [];

  torrents.forEach((torrent) => {
    torrent.files.forEach((file) => {
      results.push({
        torrentName: torrent.name,
        torrentID: torrent.id,
        fileName: file.name,
        fileURL: file.downloadUrl,
      });
    });
  });

  return results;
};

//For making output command files

const makeOutput = async (results, doMultiple, cmd) => {
  let cmdStr;

  const fpath = (result) =>
    ' "./' + result.torrentName + "/" + result.fileName + '" ';

  const makeContent = (result) => {
    let str =
      'echo "" && echo "' +
      result.fileName +
      '"\n\naria2c' +
      data.aria2Commands +
      result.torrentName +
      '" ' +
      result.fileURL +
      "\n\n";

    if (cmd) str = str + cmdStr[0] + fpath(result) + cmdStr[1] + "\n\n";

    return str;
  };

  if (results.length !== 0) {
    //results.sort((a, b) => a.torrentName.localeCompare(b.torrentName));
    if (cmd) {
      cmdStr = await utils.passInputs("Enter your commands:", false);
      cmdStr = cmdStr.split(" ");
    }

    utils.writeResult([results, "t_download", makeContent, doMultiple]);
  } else console.log("No Files in Torrents to Download");
};

const mainScreen = async (torrents) => {
  let results = [];
  const myoperations = [
    { message: "Download all Torrents  (default:enabled)", value: true },
    {
      message: "Download only Completed Files  (default:enabled)",
      value: true,
    },
    {
      message: "Download only relevent files  (default:enabled)",
      value: true,
    },
    {
      message: "Multiple Download Scripts  (default:disabled)",
      value: false,
    },
    {
      message: "Manipulte Torrents  (default:disabled)",
      value: false,
    },
    {
      message: "Manipulte Files under Torrents  (default:disabled)",
      value: false,
    },
    {
      message: "Add special commands for file processing (default:disabled)",
      value: false,
    },
  ];

  const processInput = async (operations) => {
    //Torrents Manipulation
    if (operations[4].value) {
      operations[2].value = false;
      operations[1].value = false;
      torrents = await utils_t.manipulateTorrents(torrents);
    }

    //Files Manipulation

    if (operations[5].value) {
      operations[2].value = false;
      operations[1].value = false;
      torrents = await utils_t.manipulateTorrentFiles(torrents);
    }

    utils.dataCheck(torrents, "No Torrents match your criteria.");

    //Torrent selection
    if (!operations[0].value) {
      let indexes = await utils.selectSome(
        torrents,
        utils_t.showTorrents,
        "Which Torrents to Download:"
      );
      let selectedTorrents = [];
      indexes.forEach((index) => {
        selectedTorrents.push(torrents[index]);
      });
      torrents = selectedTorrents;
    }

    //Only completed torrent
    if (operations[1].value) {
      torrents = utils_t.torrentFilePercentFilter(torrents, 100, 100);
    }

    utils.dataCheck(torrents, "No completed torrents");

    //only relevent files
    if (operations[2].value) {
      torrents = utils_t.torrentFileNameFilter(
        torrents,
        utils.checkFormats,
        []
      );
      torrents = utils_t.torrentFileNameFilter(
        torrents,
        utils.excludeKeywords,
        []
      );
    }

    utils.dataCheck(torrents, "No Torrents match your criteria");

    results = makeResult(torrents);
    makeOutput(results, operations[3].value, operations[6].value);
  };
  const banner = "\tDownload Torrents:\n\n";
  utils.dataCheck(torrents, "No torrents available");
  utils.execOperations(myoperations, processInput, false, banner);
};

exports.mainScreen = mainScreen;
