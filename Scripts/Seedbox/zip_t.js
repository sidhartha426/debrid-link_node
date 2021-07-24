const utils_t = require("./utils_t.js");
const utils = require("../utils.js");
const myrequest = require("../request.js");
const { data } = require("../data.js");
const { cls, commands, procesCmd, zip_t } = data;

const mainScreen = (torrents) => {
  let requiredTorrents = [];
  let requiredIDs = [];
  let results = [];

  const myoperations = [
    {
      message: "Zip all Torrents  (default:disabled)",
      value: false,
    },
    {
      message: "Zip all Files with in Torrents  (default:enabled)",
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
      message: "Manipulte Torrent Files  (default:disabled)",
      value: false,
    },
  ];

  const printTorrentFiles = () => {
    requiredTorrents.forEach((torrent, i) => {
      console.log("\n\t", i + 1, torrent.name, ":\n");
      torrent.files.forEach((file, j) => {
        console.log(j + 1, file.name);
      });
    });
  };

  const processInput = async (operations) => {
    //Manipulate Torrents
    if (operations[3].value) {
      torrents = await utils_t.manipulateTorrents(torrents);
      utils.dataCheck(torrents, "No torrents match your criteria");
    }

    //Select torrents
    if (operations[0].value) {
      requiredTorrents = torrents;
    } else {
      const indexes = await utils.selectSome(
        torrents,
        utils_t.showTorrents,
        "Which Torrents to ZIP:"
      );
      indexes.forEach((index) => {
        requiredTorrents.push(torrents[index]);
      });
    }

    let makeConformation = await utils.confromationScreen(
      "Selected Torrents for Zipping:\n",
      requiredTorrents
    );

    if (!makeConformation) {
      console.log("Zip operation Cancelled");
      process.exit();
    }

    //Manipulate Files
    if (operations[4].value) {
      requiredTorrents = await utils_t.manipulateTorrentFiles(requiredTorrents);
      requiredTorrents.forEach((torrent) => {
        utils.dataCheck(torrent.files, "Some torrents found with no files");
      });
    }

    //Select files with in torrents
    if (operations[1].value) {
      requiredTorrents.forEach((torrent) => {
        let ids = [];
        torrent.files.forEach((file) => {
          ids.push(file.id);
        });
        requiredIDs.push(ids);
      });
    } else {
      for (let i = 0; i < requiredTorrents.length; i += 1) {
        let ids = [];
        let files = [];
        let torrent = requiredTorrents[i];
        let indexes = await utils.selectSome(
          torrent.files,
          (data) => {
            console.log("\t", i + 1, torrent.name + ":\n");
            utils.printNames(data);
          },
          "Which Files to add:"
        );
        indexes.forEach((index) => {
          ids.push(torrent.files[index].id);
          files.push(torrent.files[index]);
        });
        torrent.files = files;
        requiredIDs.push(ids);
      }
    }

    const processResult = () => {
      cls();

      const makeContent = (result) =>
        'echo "" && echo "' +
        result.name +
        '"\n\naria2c' +
        data.aria2Commands +
        '" ' +
        result.fileURL +
        "\n\n";

      if (results.length > 0) {
        utils.writeResult([
          results,
          "tz_download",
          makeContent,
          operations[2].value,
        ]);
      } else console.log("No torrents available for zipping");
    };

    const makeRequest = async () => {
      console.log("Please Wait ... \nExecuting Request online\n\n");

      for (let i = 0; i < requiredTorrents.length; i += 1) {
        let torrent = requiredTorrents[i];
        const requiredData = await myrequest
          .makeWriteRequest(
            "POST",
            zip_t.getpath(torrent.id),
            zip_t.getPostData(requiredIDs[i])
          )
          .then((receivedData) => receivedData)
          .catch((err) => {
            cls();
            console.log(err);
            process.exit();
          });
        try {
          if (requiredData.success) {
            console.log("Request executed Successfully.");
            console.log("Result:", requiredData.value.status);
            results.push({
              name: torrent.name,
              fileURL: requiredData.value.downloadUrl,
            });
          } else {
            console.log("Some Error Occured.");
            console.log("Result:\n");
            console.log(requiredData);
          }
        } catch (e) {
          cls();
          console.log(e);
          process.exit();
        }
      }
      console.log("");
      await utils.waitKeyStroke();
      processResult();
    };

    makeConformation = await utils.confromationScreen(
      "Selected Torrents and files for Zipping:",
      requiredTorrents,
      printTorrentFiles
    );

    if (makeConformation) {
      makeRequest();
    } else {
      console.log("Zipping operation Cancelled");
    }
  };

  const banner = "\tZip Torrents:\n\n";
  utils.dataCheck(torrents, "No torrents available");
  utils.execOperations(myoperations, processInput, false, banner);
};

exports.mainScreen = mainScreen;
