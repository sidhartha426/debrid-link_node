const readline = require("readline");
const utils = require("../utils.js");
const { data } = require("../data.js");
const { cls, commands, procesCmd } = data;

//Authorization Functions

const appRegister = require("./register_app.js");
const accessToken = require("./access_token.js");
const refreshToken = require("./refresh_token.js");

const mainScreen = () => {
  const featuresData = {
    appauth: [
      { message: "Register App", execFunction: appRegister.makeRequest },
      { message: "Get AccessToken", execFunction: accessToken.makeRequest },
      {
        message: "Refresh AccessToken",
        execFunction: refreshToken.makeRequest,
      },
    ],
    getSectionsData: function () {
      sections = [this.appauth];
      sectionsLength = [];
      sectionsData = [false];
      let t = 0;
      for (let i = 0; i < sections.length; i += 1) {
        t += sections[i].length;
        sectionsLength.push(t);
      }
      return [sections, sectionsLength, sectionsData];
    },
    sectionsBanner: ["App Authorization:"],
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
      str+="\n\nMessage: Please authorize your app to use it's all features\n"
      str +=
        "\nCommmands =>\ne/exit: To exit\nr/reprint: To reprint current screen\n\n" +
        "Enter Choice:";

      return str;
    },
  };
  utils.mainMenuExec(featuresData);
};

exports.mainScreen = mainScreen;
