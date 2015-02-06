

'use strict';

var _ = require('lodash'),
    temp = require('temp'),
    fs   = require('fs'),
    exec = require('child_process').exec;

// Automatically track and cleanup files at exit
temp.track();

exports.compare = function(req, res) {
  doCompare(req, res, false);
};

exports.compareMarkdown = function(req, res) {
  doCompare(req, res, true);
};

// Perform a comparison
// The request should be a json object with two string fields: 'a' and 'b'
 function doCompare(req, res, isMarkdown) {

  //check for properly formatted request
  if (req.headers["content-type"].toLowerCase() != "application/json")
    return handleError(res, {error: "Content-type must be 'application/json'"});

  if (!req.body.a || !req.body.b)
    return handleError(res, {error: "Request data should be of the form {a:'text a', b:'text b'}"});

  var a = req.body.a;
  var b = req.body.b;

  //!!! this nested file-open is not a good pattern
  // better would be to use promises and write the two files asynchronously

  // open the first file
  temp.open('wdiffa-', function(err, filea) {
    //handle errors
    if (err) 
      return handleError(res, err);

    //write the string to the file
    fs.write(filea.fd, a);

    //close the file
    fs.close(filea.fd, function(err) {
      if (err)
        return handleError(res, err);

      //open the second file
      temp.open('wdiffa-', function(err, fileb) {
        if (err) 
          return handleError(res, err);

        //write the string to the file
        fs.write(fileb.fd, b);

        //close the file
        fs.close(fileb.fd, function(err) {
          if (err)
            return handleError(res, err);

          var cmd = "./bin/wdiff " + filea.path + " " +fileb.path;
          exec(cmd, function(err, stdout) {
            
            if (err && err.code!=1 && err.code!=0) {  
              return handleError(res,err);
            }

            //if no difference was found by wdiff, err.code will be 0
            var wdiffSame;
            wdiffSame = (err && err.code == 0) ? true:false;

            //sub del and ins 
            var markdown = stdout;
            markdown = markdown.replace(/\[-/g, '<del>');
            markdown = markdown.replace(/-\]/g, '</del>');
            markdown = markdown.replace(/{\+/g, '<ins>');
            markdown = markdown.replace(/\+}/g, '</ins>');

            var resData = {wdiff:stdout, same: wdiffSame, markdown: markdown};
          });
        });
      });
    });
  });
}


function handleError(res, err) {
  return res.send(500, err);
}