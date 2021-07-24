const readline = require("readline");
const utils = require("./Scripts/utils.js");
const { data } = require("./Scripts/data.js");
const { cls, commands, procesCmd } = data;

//Torrent (Seedbox) Functions

const add_t = require("./Scripts/Seedbox/add_t.js");
const delete_t = require("./Scripts/Seedbox/delete_t.js");
const download_t = require("./Scripts/Seedbox/download_t.js");
const fetch_t = require("./Scripts/Seedbox/fetch_t.js");
const show_t = require("./Scripts/Seedbox/show_t.js");
const zip_t = require("./Scripts/Seedbox/zip_t.js");

//Files (Downloader) Functions

const add_d = require("./Scripts/Downloader/add_d.js");
const delete_d = require("./Scripts/Downloader/delete_d.js");
const download_d = require("./Scripts/Downloader/download_d.js");
const fetch_d = require("./Scripts/Downloader/fetch_d.js");
const show_d = require("./Scripts/Downloader/show_d.js");

//Appauth Functions for app authorization

const appRegister = require("./Scripts/Appauth/register_app.js");
const accessToken = require("./Scripts/Appauth/access_token.js");
const refreshToken = require("./Scripts/Appauth/refresh_token.js");
const mainAuth = require("./Scripts/Appauth/mainAuth.js");

let torrentsInfo, filesInfo, torrents, files;

const init = async () => {
  //Waiting Screen
  cls();
  console.log("Please Wait ....\nGetting Data from internet.");

  //For fecting Data

  const fetchData = async (fetchFunction) => {
    const data = await fetchFunction()
      .then((receivedData) => receivedData)
      .catch((err) => {
        cls();
        console.log(err);
        process.exit();
      });

    return data;
  };

  //Fetches data

  torrentsInfo = await fetchData(fetch_t.fetch);
  filesInfo = await fetchData(fetch_d.fetch);

  //For faking empty data scenario (for testing purposes)

  // filesInfo={success:true,value:[]}
  // torrentsInfo={success:true,value:[]}

  //Executes mainscreen after fetching data

  if (torrentsInfo.success && filesInfo.success) {
    torrents = torrentsInfo.value;
    files = filesInfo.value;

    torrents.sort((a, b) => a.name.localeCompare(b.name));
    files.sort((a, b) => a.name.localeCompare(b.name));

    //Writes data (test data) for testing
    data.writeFile(
      __dirname + "/Scripts/Seedbox/Data/testdata.json",
      JSON.stringify(torrents)
    );
    data.writeFile(
      __dirname + "/Scripts/Downloader/Data/testdata.json",
      JSON.stringify(files)
    );

    //refreshes torrents data (local data)
    add_t.refreshData(torrents);

    mainScreen();
  } else if (
    (torrentsInfo.error && torrentsInfo.error === "badToken") ||
    (filesInfo.error && filesInfo.error === "badToken")
  )
    mainAuth.mainScreen();
  else {
    cls();
    console.log("Data Fetching error\n");
  }
};

const mainScreen = () => {
  //Data Including executing fuctions and feature name
  const featuresData = {
    seedbox: [
      {
        message: "Download Torrents",
        execFunction: download_t.mainScreen,
      },
      {
        message: "Show Torrents",
        execFunction: show_t.mainScreen,
      },
      {
        message: "Add Torrents",
        execFunction: add_t.mainScreen,
      },
      {
        message: "Remove Torrents",
        execFunction: delete_t.mainScreen,
      },
      {
        message: "ZIP Torrents",
        execFunction: zip_t.mainScreen,
      },
    ],
    downloader: [
      {
        message: "Download Files",
        execFunction: download_d.mainScreen,
      },
      {
        message: "Show Files",
        execFunction: show_d.mainScreen,
      },
      {
        message: "Add Files",
        execFunction: add_d.mainScreen,
      },
      {
        message: "Remove Files",
        execFunction: delete_d.mainScreen,
      },
    ],
    appauth: [
      {
        message: "Register App",
        execFunction: appRegister.makeRequest,
      },
      {
        message: "Get AccessToken",
        execFunction: accessToken.makeRequest,
      },
      {
        message: "Refresh AccessToken",
        execFunction: refreshToken.makeRequest,
      },
    ],
    getSectionsData: function () {
      sections = [this.seedbox, this.downloader, this.appauth];
      sectionsLength = [];
      sectionsData = [torrents, files, false];
      let t = 0;
      for (let i = 0; i < sections.length; i += 1) {
        t += sections[i].length;
        sectionsLength.push(t);
      }
      return [sections, sectionsLength, sectionsData];
    },
    sectionsBanner: ["Torrents:", "Downloads:", "App Authorization:"],
    inputScreen: function () {
      let str = "";

      str += "\t\tDebrid-Link API\n\n";

      let [sections, sectionsLength] = this.getSectionsData();

      for (let i = 0; i < sections.length; i += 1) {
        str += "\n\t " + this.sectionsBanner[i] + "\n\n";
        let j = 1;
        if (i > 0) j = sectionsLength[i - 1] + 1;
        sections[i].forEach((section, i) => {
          str += (i + j).toString() + ". " + section.message + "\n";
        });
      }

      str +=
        "\nCommmands =>\ne/exit: To exit\nr/reprint: To reprint current screen\n\n" +
        "Enter Choice:";

      return str;
    },
  };
  utils.mainMenuExec(featuresData);
};

init();
