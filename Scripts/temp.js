const utils = require("./utils.js");
const utils_t=require("./Seedbox/utils_t.js")
const add_t=require("./Seedbox/add_t.js")
const { data } = require("./data.js");
const { readFile, writeFile } = data;
const torrents = JSON.parse(
  readFile(__dirname + "/Seedbox/Data/testdata.json")
);

let history = JSON.parse(
  readFile(__dirname + "/Seedbox/Data/add_t_history.json")
);
let archive = JSON.parse(
  readFile(__dirname + "/Seedbox/Data/add_t_archive.json")
);
let queue = JSON.parse(
  readFile(__dirname + "/Seedbox/Data/add_t_queue.json")
);
//
// torrents.forEach((torrent) => {
//   history.order.push(torrent.hashString);
//   history[torrent.hashString] = {
//     name: torrent.name,
//     url: torrent.name,
//   };
// });
//
// writeFile(
//   __dirname + "/Seedbox/Data/add_t_history.json",
//   JSON.stringify(history)
// );

//add_t.mainScreen(torrents)

const compltedTorrents = torrents.filter((torrent) =>
  utils_t.checkCompleted(torrent)
);

// console.log(torrents.length,compltedTorrents.length)
//
// console.log(history.order.length,archive.order.length,queue.length)
//
// torrents.forEach((torrent)=>{
//   console.log(torrent.name)
// })
// console.log("\n\n\n")
// compltedTorrents.forEach((torrent)=>{
//   console.log(torrent.name)
// })
console.log("\n\n\n")

console.log(history.order.length,Object.keys(history).length)
console.log(archive.order.length,Object.keys(archive).length)
// history.order.forEach((record)=>{
//   console.log(history[record])
// })

// console.log("\n\n\n")
// archive.order.forEach((record)=>{
//   console.log(archive[record].name)
// })


// const makeRequest = async (urls) => {
//   let results = [];
//   urls.forEach((url, i) => {
//     results.push({
//       success: true,
//       value: {
//         name: "torrent" + (i + 1).toString(),
//         hashString: "torrent" + (i + 1).toString(),
//       },
//     });
//   });
//   results.pop();
//   results.pop();
//   results.pop();
//   results.pop();
//   return new Promise((resolve) => {
//     resolve(results);
//   });
// };




// const mf = async () => {
//   //utils.readFileLines(__dirname+"../magnets.txt");
//
//   //console.log(utils.readFileLines(__dirname+"/../magnets.txt"))
//   //
//   // console.log(data.add_t.getURLs);
//   // console.log(data.add_d.getURLs);
//   //
//   // console.log(data.path_delete_t(["a", "b", "c"]));
//   // console.log(data.zip_t.getPostData(["a", "b", "c"]));
//   //
//   // console.log(data.path_delete_d(["a", "b", "c"]));
//
//   t= await utils.monitorClipboard();
//
//   console.log(t);
// };
// mf();
// const torrents = JSON.parse(
//   data.readFile(__dirname + "/Seedbox/Data/testdata.json")
// );
// console.log("Request executed Successfully.");
// console.log("Deleted Torrents are:\n");
// utils.printNames(torrents);

// const { data } = require("./data.js");
// const utils_t = require("./Seedbox/utils_t.js");
// const torrentsInfo = JSON.parse(
//   data.readFile(__dirname + "/Seedbox/Data/testdata.json")
// );
//
// const mf = async () => {
//   //torrents = await utils_t.manipulateTorrents(torrentsInfo.value);
//   let t="";
//   torrents=torrentsInfo.value;
//
//   torrents.forEach((torrent)=>{
//     if(torrent.id==="71960dee83fdc466698")
//     {
//       torrent.files.forEach((item, i) => {
//         if(item.name.endsWith(".jpg"))
//         t+=item.id+","
//       });
//
//
//     }
//
//     data.writeFile(__dirname+"/temp.txt",t)
//
//   })
//
//   console.log(t);

//torrents=torrentsInfo.value

// torrents.forEach((torrent)=>{
//   console.log(torrent.name,utils_t.checkDownloaded(torrent, false))
//   //console.log(torrent.name,!utils_t.checkDownloaded(torrent))
//
// })
// console.log("\n\n\n")
// torrents.forEach((torrent)=>{
//   //console.log(torrent.name,utils_t.checkDownloaded(torrent, true))
//   console.log(torrent.name,!utils_t.checkDownloaded(torrent, false))
//
// })

// };
// mf();

// const mf=async ()=>{
//   torrents = await utils_t.manipulateTorrentFiles(torrents);
//   torrents.forEach((torrent, i) => {
//     console.log(torrent.files);
//   });
// }

// mf();

// const { data } = require("./data.js");
// const utils_t = require("./Seedbox/utils_t.js");
// const utils = require("./utils.js");
//
// const torrentsInfo = JSON.parse(
//   data.readFile(__dirname + "/Seedbox/Data/testdata.json")
// );
//
// let torrents = torrentsInfo.value;
//
// //console.log(torrents);
// // console.log(torrents[0].files.length,
// // torrents[1].files.length);
// torrents.forEach((torrent, i) => {
//   console.log(torrent.name);
// });
//
// console.log("\n\n\n")
// torrents=utils_t.torrentNameFilter(
//   torrents,
//   utils.searchKeywords,
//   ["ray","fake"]
// );
//
// torrents.forEach((torrent, i) => {
//   console.log(torrent.name);
// });

// torrents.forEach((torrent, i) => {
//   console.log(torrent.files);
// });

// console.log(torrents[0].files.length,
// torrents[1].files.length);
