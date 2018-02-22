const path2Search = 'D:\\present';

const fs = require('fs');
const path = require('path');


function getFiles(dir, files_) {
    files_ = files_ || [];
    var files = fs.readdirSync(dir);

    for (var i in files) {
        var name = dir + '/' + files[i];
        if (fs.statSync(name).isDirectory()) {
            getFiles(name, files_);
        } else {
            files_.push(name);
        }
    }
    return files_;
}

function map_to_object(map) {
    const out = Object.create(null)
    map.forEach((value, key) => {
        if (value instanceof Map) {
        out[key] = map_to_object(value)
    }
else {
        out[key] = value
    }
})
    return out;
}

function getFilesizeInBytes(filename) {
    const stats = fs.statSync(filename)
    const fileSizeInBytes = stats.size
    let fileSizeInMegabytes = fileSizeInBytes / 1000000.0;
    return fileSizeInMegabytes;
}

let fileMap = new Map();

getFiles(path2Search).forEach(function (file) {
    let size = getFilesizeInBytes(file);
    let fileName = path.basename(file);
    let fullName = file.split('.');
    let extention = fullName[fullName.length - 1];

    console.log(fileName + " EXTENTION - " + extention);
    if(!fileMap.has(extention)){
        const container = {
            counter: 1,
            size: size,
        };
        fileMap.set(extention, container);
    }else{
        let counter =  fileMap.get(extention);
        counter.counter += 1;
        counter.size += size;
        fileMap.set(extention, counter );

    }
});

const jsonOBJ = map_to_object(fileMap);
console.log(jsonOBJ);
let content = JSON.stringify(jsonOBJ);

fs.writeFile("files_db.json", content, 'utf8', function (err) {
    if (err) {
        return console.log(err);
    }

    console.log("The file was saved!");
});