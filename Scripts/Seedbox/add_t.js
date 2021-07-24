const utils_t = require("./utils_t.js");
const utils = require("../utils.js");
const myrequest = require("../request.js");
const { data } = require("../data.js");
const {
  cls,
  commands,
  procesCmd,
  add_t,
  readFile,
  writeFile,
  URLKeywords,
} = data;

let history, archive, queue;

const readData = () => {
  history = JSON.parse(readFile(__dirname + "/Data/add_t_history.json"));
  archive = JSON.parse(readFile(__dirname + "/Data/add_t_archive.json"));
  queue = JSON.parse(readFile(__dirname + "/Data/add_t_queue.json"));
};

const refreshData = (torrents) => {
  const refreshHistory = () => {
    const compltedTorrents = torrents.filter((torrent) =>
      utils_t.checkCompleted(torrent)
    );
    if (compltedTorrents.length > 0) {
      compltedTorrents.forEach((torrent) => {
        if (history[torrent.hashString]) {
          if (!archive[torrent.hashString]) {
            archive.order.push(torrent.hashString);
            archive[torrent.hashString] = history[torrent.hashString];
            delete history[torrent.hashString];
            history.order = history.order.filter(
              (entry) => entry !== torrent.hashString
            );
          } else {
            delete history[torrent.hashString];
            history.order = history.order.filter(
              (entry) => entry !== torrent.hashString
            );
          }
        }
      });
    }
    writeHistory(history);
    writeArchive(archive);
  };
  readData();
  console.log(history);
  if (torrents.length > 0 && history.order.length > 0) refreshHistory();
};

const writeHistory = (fdata) => {
  writeFile(__dirname + "/Data/add_t_history.json", JSON.stringify(fdata));
};
const writeQueue = (fdata) => {
  writeFile(__dirname + "/Data/add_t_queue.json", JSON.stringify(fdata));
};
const writeArchive = (fdata) => {
  writeFile(__dirname + "/Data/add_t_archive.json", JSON.stringify(fdata));
};
const modifyFile = (fdata) => {
  let content = "";
  fdata.forEach((record) => {
    content += record + "\n";
  });
  writeFile(__dirname + "/../../magnets.txt", content);
};

const mainScreen = (torrents) => {
  const myoperations = [
    {
      message: "Add Torrents from clipboard  (default:disabled)",
      value: false,
    },
    {
      message: "Add Torrents from magnets file  (default:disabled)",
      value: false,
    },
    {
      message: "Add Torrents from history  (default:disabled)",
      value: false,
    },
    {
      message: "Add Torrents from queue  (default:disabled)",
      value: false,
    },
    {
      message: "Add Torrents from archive  (default:disabled)",
      value: false,
    },
    {
      message: "Clear archive  (default:disabled)",
      value: false,
    },
    {
      message: "Clear queue  (default:disabled)",
      value: false,
    },
    {
      message: "Clear history  (default:disabled)",
      value: false,
    },
  ];

  //Idea => add success /fail (processed) -> history add fail (unprocessed)-> queue
  //added&downloaded (processed)-> archive

  // object struct : order:[],hashString:{name:,url:}

  //Makes continueous requests after a urls array and returns results array
  const makeRequest = async (urls) => {
    const results = [];
    let s = 0;
    const mf = async (resolve) => {
      cls();
      console.log("Please Wait ... \nExecuting Request online\n\n");
      for (let i = 0; i < urls.length; i += 1) {
        let url = urls[i];
        const requiredData = await myrequest
          .makeWriteRequest("POST", add_t.path, add_t.getPostData(url))
          .then((receivedData) => receivedData)
          .catch((err) => {
            cls();
            console.log(err);
            process.exit();
          });
        if (requiredData.success) {
          console.log("Request executed Successfully.");
          results.push(requiredData);
          s += 1;
        } else break;
      }
      if (s > 0) {
        cls();
        console.log("\t", s, "torrents added successfully.\n\n");
        results.forEach((result, i) => {
          console.log(i + 1, result.value.name);
        });
        console.log("\n");
        await utils.waitKeyStroke();
      }
      resolve(results);
    };
    return new Promise((resolve, reject) => {
      mf(resolve);
    });
  };

  //Updates history after successful results
  const updateHistory = async (results, urls) => {
    results.forEach((result, i) => {
      torrent = result.value;
      if (!history[torrent.hashString]) {
        history.order.push(torrent.hashString);
        history[torrent.hashString] = {
          name: torrent.name,
          url: urls[i],
        };
      }
    });
  };

  //select something from clipboard
  const clipSelect = async (arr, msg) => {
    let rarr = []; //array to be returned
    const mf = async (resolve) => {
      let indexes = await utils.selectSome(arr, utils.printFwdArr, msg);
      indexes.forEach((i) => {
        rarr.push(arr[i]);
      });
      resolve(rarr);
    };
    return new Promise((resolve, reject) => {
      mf(resolve);
    });
  };

  //Process file data
  const processFile = async (arr) => {
    let rarr = []; //required URLS
    const mf = async (resolve) => {
      const msg = "Which urls to add:";
      let indexes = await utils.selectSome(arr, utils.printFwdArr, msg);
      indexes.forEach((i) => {
        rarr.push(arr[i]);
      });
      arr = arr.filter((record, i) => !indexes.includes(i));
      modifyFile(arr);
      resolve(rarr);
    };
    return new Promise((resolve, reject) => {
      mf(resolve);
    });
  };

  //Process result (add in history and queue)
  const processResult = (results, urls) => {
    if (results.length > 0) {
      updateHistory(results, urls);
      queue = [...queue, ...urls.slice(results.length).reverse()];
    } else {
      console.log("Can't add torrents.");
      queue = [...queue, ...urls.reverse()];
    }
  };

  const processInput = async (operations) => {
    //clipboard
    if (operations[0].value) {
      let clips = await utils.monitorClipboard();
      clips.filter((clip) => utils.searchKeywords(clip, URLKeywords));
      clips = await clipSelect(clips, "Select Which clips to send:");
      let results = await makeRequest(clips);
      processResult(results, clips);
    }
    //files
    if (operations[1].value) {
      let urls = add_t.getURLs;
      if (urls.length > 0) {
        urls.filter((url) => utils.searchKeywords(url, URLKeywords));
        urls = await processFile(urls);
        let results = await makeRequest(urls);
        processResult(results, urls);
      } else console.log("No content present in file.");
    }
    //queue
    if (operations[3].value) {
      if (queue.length > 0) {
        const msg = "Select which urls to send:";
        const indexes = await utils.selectSome(queue, utils.printRevArr, msg);
        const tqueue = []; //temp queue
        indexes.forEach((i) => {
          tqueue.push(queue[queue.length - (i + 1)]);
        });
        queue = queue.filter(
          (record, i) => !indexes.includes(queue.length - (i + 1))
        );
        const results = await makeRequest(tqueue);
        processResult(results, tqueue);
      } else console.log("No records in queue.");
    }
    //history
    if (operations[2].value) {
      if (history.order.length > 0) {
        const msg = "Select which urls to send:";
        const indexes = await utils.selectSome(history, utils.printRevObj, msg);
        const tqueue = [];
        const torder = []; //temp order
        let order = history.order;
        indexes.forEach((i) => {
          tqueue.push(history[order[order.length - (i + 1)]].url);
          torder.push(order[order.length - (i + 1)]);
        });
        history.order = history.order.filter(
          (record, i) => !indexes.includes(order.length - (i + 1))
        );
        history.order = [...history.order, ...torder.reverse()];
        const results = await makeRequest(tqueue);
        if (results.length === 0) {
          console.log("Can't add torrents");
        }
      } else console.log("No records in history.");
    }
    //archive
    if (operations[4].value) {
      if (archive.order.length > 0) {
        const msg = "Select which urls to send:";
        const indexes = await utils.selectSome(archive, utils.printRevObj, msg);
        const tqueue = [];
        const torder = []; //temp order
        let order = archive.order;
        indexes.forEach((i) => {
          tqueue.push(archive[order[order.length - (i + 1)]].url);
          torder.push(order[order.length - (i + 1)]);
        });
        archive.order = archive.order.filter(
          (record, i) => !indexes.includes(order.length - (i + 1))
        );
        torder.reverse();
        torder.forEach((hash) => {
          history.order.push(hash);
          history[hash] = archive[hash];
          delete archive[hash];
        });
        const results = await makeRequest(tqueue);
        if (results.length === 0) console.log("Can't add torrents");
      } else console.log("No records in archive.");
    }
    //clear archive
    if (operations[5].value) {
      archive = await utils.modifyObj(archive);
    }
    //clear history
    if (operations[7].value) {
      history = await utils.modifyObj(history);
    }
    //clear queue
    if (operations[6].value) {
      queue = await utils.modifyArr(queue);
    }

    writeHistory(history);
    writeQueue(queue);
    writeArchive(archive);
  };

  const banner = "\tAdd Torrents:\n\n";
  refreshData(torrents);
  utils.execOperations(myoperations, processInput, false, banner);
};

exports.mainScreen = mainScreen;
exports.refreshData = refreshData;
