'use strict';

var _ = require('lodash'),
    temp = require('temp'),
    fs   = require('fs'),
    exec = require('child_process').exec;

// Automatically track and cleanup files at exit
temp.track();

// Perform a comparison between a and b
// the callback should have parameters (err, result) 
module.exports = function(a, b, asMarkdown, callback) {

  //!!! this nested file-open is not a good pattern
  // better would be to use promises and write the two files asynchronously

  // open the first file
  temp.open('wdiffa-', function(err, filea) {
    //handle errors
    if (err) 
      return callback(err);

    //write the string to the file
    fs.write(filea.fd, a);

    //close the file
    fs.close(filea.fd, function(err) {
      if (err)
        return callback(err);

      //open the second file
      temp.open('wdiffa-', function(err, fileb) {
        if (err) 
          return callback(err);

        //write the string to the file
        fs.write(fileb.fd, b);

        //close the file
        fs.close(fileb.fd, function(err) {
          if (err)
            return callback(err);

          var cmd = "./bin/wdiff " + filea.path + " " +fileb.path;
          exec(cmd, function(err, stdout) {
            
            if (err && err.code!=1 && err.code!=0) {  
              return callback(err);
            }

            //if no difference was found by wdiff, err.code will be 0
            var wdiffSame;
            wdiffSame = (err && err.code == 0) ? true:false;


            var resData = {wdiff:stdout, same: wdiffSame};
            if (asMarkdown) {

              //!!! this needs more sophisticated parsing
              //sub del and ins for the wdiff tags
              var markdown = stdout;
              markdown = markdown.replace(/\[-/g, '<del>');
              markdown = markdown.replace(/-\]/g, '</del>');
              markdown = markdown.replace(/{\+/g, '<ins>');
              markdown = markdown.replace(/\+}/g, '</ins>');
              resData.wdiff=markdown;
            }

            return callback(null, resData);
          });
        });
      });
    });
  });
}
