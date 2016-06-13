var fs = require('fs');

if (!String.prototype.trim) {
  String.prototype.trim = function () {
    return this.replace(/^[\s\uFEFF\xA0]+|[\s\uFEFF\xA0]+$/g, '');
  };
}

function readfile(name, online, onend, encoding) {
    var bufsize = 1024;
    var buffer = new Buffer(bufsize);
    var bufread = 0;
    var fd = fs.openSync(name,'r');
    var position = 0;
    var eof = false;
    var data = "";
    var lines = 0;

    encoding = encoding || "utf8";

    function readbuf() {
        bufread = fs.readSync(fd,buffer,0,bufsize,position);
        position += bufread;
        eof = bufread ? false : true;
        data += buffer.toString(encoding,0,bufread);
    }

    function getLine() {
        var nl = data.indexOf("\r"), hasnl = nl !== -1;
        if (!hasnl && eof) return fs.closeSync(fd), online(data,++lines), onend(lines); 
        if (!hasnl && !eof) readbuf(), nl = data.indexOf("\r"), hasnl = nl !== -1;
        if (!hasnl) return process.nextTick(getLine);
        var line = data.substr(0,nl);
        data = data.substr(nl+1);
        if (data[0] === "\n") data = data.substr(1);
        online(line,++lines);
        process.nextTick(getLine);
    }
    getLine();
}

function handleFile(){
    var arr = [];
    var content = readfile("./src/hosts", function(data, line){
        if(data.indexOf("#") != -1){
            return;
        }
        data = data.trim();
        if(data === ""){
            return;
        }
        arr.push(data);
    }, function(){
        arr = Array.from(new Set(arr));
        fs.writeFileSync('dist/hosts', arr.join("\n"));
    }, "ascii");
}

handleFile();