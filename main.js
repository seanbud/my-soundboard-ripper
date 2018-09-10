// imports & setup
var fs = require('fs');
var request = require('request');
const CLIP_LIST = "http://www.realmofdarkness.net/scripts/sb/vg/mgs/mgs/snake/sounds.js";
const SOURCE_URL = "http://www.realmofdarkness.net/audio/vg/mgs/mgs/snake/";
const DEST_DIR = "./sounds/";
var i = 0;

// download list of clip names
function get_cliplist(callback) {
  // download js file
  request
  .get(CLIP_LIST)
  .on('error', function(err) {
    // handle error
    console.log("Could not get file list! "+err);
  })
  .pipe(fs.createWriteStream("sounds.js"))
  .once('finish', function () {
    // append export to new file
    var exp = "\nmodule.exports = { sounds };";
    fs.appendFileSync('./sounds.js', exp);

    // log
    console.log(" +  sounds.js");
    i++;

    // return;
    var arr = require('./sounds.js').sounds;
    callback(arr);
  });
}

// download mp3 file from url by clip name
function download_clip(clip_name) {
  // setup
  var src = SOURCE_URL + clip_name + ".mp3";
  var dest = DEST_DIR + clip_name + ".mp3";

  // request
  request
  .get(src)
  .on('error', function(err) {
    // handle error
    console.log(" --  " + clip_name);
  })
  .pipe(fs.createWriteStream(dest))
  .once('finish', function () {
    // log, inc total
    console.log(" +  " + clip_name + ".mp3");
  });

  i++;
}

//-------------------------------
// Main
console.log("Starting download .. ");
get_cliplist(function(arr) {
    for (var k in arr) {
      download_clip(arr[k]);
    }
    console.log("\nDownload complete. " + i + " files downloaded.\n");
});
