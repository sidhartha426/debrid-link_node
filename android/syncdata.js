const { data } = require("../Scripts/data.js");

const originalFile = data
  .readFile(__dirname + "/../Scripts/data.js")
  .toString()
  .split("\n");


originalFile.forEach((line,i)=>{
  if(line && line.includes("out_path"))
    originalFile[i]="data.out_path =\"./Download_Scripts/\";";
  else if (line && line.includes("aria2Commands"))
    originalFile[i]='data.aria2Commands = \' -x 8 --file-allocation=none -d "/sdcard/Dlink/\'';

});

let newFileContent="";

originalFile.forEach((line)=>{
  if(line)
    newFileContent+=line+"\n";
});

data.writeFile(__dirname+"/data.js",newFileContent);
