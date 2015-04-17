'use strict';

var _ = require('lodash'),
    temp = require('temp'),
    fs   = require('fs'),
    exec = require('child_process').exec,
    Lexer = require('lex');

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
//console.log(cmd);
//console.log(err);
//console.log(stdout);            
            if (err && err.code!=1 && err.code!=0) {  
              return callback(err);
            }
            //if no difference was found by wdiff, err.code will be 0
            var wdiffSame;
            wdiffSame = (err && err.code == 0) ? true:false;


            var resData = {wdiff:stdout, same: wdiffSame};
            if (asMarkdown) {

              //!!! this needs more sophisticated parsing

              var markdown = rewriteWdiffMarkdown(stdout)
              
              resData.wdiff=markdown;
            }

            return callback(null, resData);
          });
        });
      });
    });
  });
}

/* Rewrites the given wdiff output to correctly render as markdown,
  assuming the source documents were also valid markdown. */
function rewriteWdiffMarkdown(source) {

  //initialize a stack for the lexed input
  //make it a lodash container, just for kicks 
  var tokens = _([]);

  //define tokens
  var LDEL = {type:"LDEL"}, RDEL = {type:"RDEL"}, LINS = {type:"LINS"}, RINS = {type:"RINS"};
  //var STRING = {type: "STRING", value:""};
  var RDEL_LINS = {type:"RDEL_LINS"};
  var NEWLINE = {type:"\n"};

  var isStringToken = function (token) { return token.type == "STRING";} 


  //create a lexer to process the wdiff string
  var lexer = new Lexer(function (char) {
    //the default rule creates a string on the stack for unmatched characters
    //and just adds characters to it as they come in 
    if (tokens.size() == 0 || !isStringToken(tokens.last()))
      tokens.push({type: "STRING", value:""});

    tokens.last().value += char;
  });

  //rules for the newline character, 
  //as well as opening and closing (left and right) delete and insert tokens
  lexer
    .addRule(/\[-/, function () {
      tokens.push(LDEL);
    })
    .addRule(/-\]/, function () {
      tokens.push(RDEL);
    })
    .addRule(/{\+/, function () {
      tokens.push(LINS);
    })
    .addRule(/\+}/, function () {
      tokens.push(RINS);
    })
    //we have a special rule for joined delete and insert tokens
    .addRule(/-\] {\+/, function() {
      tokens.push(RDEL_LINS);
    })
    .addRule(/\n/, function () {
      //tokens.push({type:"STRING", value:"\n"})
      tokens.push(NEWLINE);
    })
    ;
  

  //do the lexing
  lexer.setInput(source);
  lexer.lex();

  //# now we parse and transform the input

  //create a stack for the transformed output
  var transform = _([]);

  //set the state variables for the parse
  var SSTRING = "string", SINS = "ins", SDEL = "del", SDELINS = "delins";
  var state = SSTRING;

  //this is the index of the immediately previous delete string in the transform stack 
  var deleteStartIndex = -1

  //iterate the input tokens to create the intermediate representation 
  tokens.forEach(function(token) {
    //we add string tokens to the transformed stack
    if (isStringToken(token)) {
      //add the string with state information
      var item = {
        string: token.value,
        state: state
      };
      //if this is the DELINS state, we will put the string in the transformed stack in a different order
      // the INS string is spliced into place just after the first DEL string
      // the point of this is so that the preceeding markdown formatting instructions
      // on this line are applied equally to the del and ins strings
      // an extra space is inserted between DEL and INS items, for readibility
      if (state == SDELINS) {
        state = SINS;
        item.state = SINS;
        var spaceItem = {string: ' ', state: SSTRING};
        transform.splice(deleteStartIndex+1, 0, item);
        transform.splice(deleteStartIndex+1, 0, spaceItem);

      }
      else {
        transform.push(item);
      }
    }
    //the various tokens control the transformation mode
    if (token == LDEL) {
      state = SDEL;
      deleteStartIndex = transform.size();
    }
    if (token == LINS) {
      state = SINS;
    }
    if (token == RDEL || token == RINS) {
      state = SSTRING;
      deleteStartIndex = -1;
    }
    if (token == RDEL_LINS) {
      state = SDELINS;
    }

    if (token == NEWLINE) {
      transform.push({string: '\n', state: state});
    }

    //ignore newlines (they get added to the output)
  });


  // * now emit the output string
  var output = "";
  var newline = true;

  // prefixes are matched as follows:
    // ^                  - start of line
    // ([ \t]*\>)*       - blockquotes (possibly nested)
    // (
    //  ([ \t]*#*)      - headers 
    //  |([ \t]+[\*\+-])     - unordered lists
    //  |([ \t]+[0-9]+\.)  - numeric lists
    // )?
    // [ \t]+             - trailing whitespace
  var PREFIX =  /^([ \t]*\>)*(([ \t]*#*)|([ \t]*[\*\+-])|([ \t]*[\d]+\.))?[ \t]+/
  //var PREFIX = /^#*/


  transform.forEach(function(item) {
    //newlines are undecorated
    if (item.string == '\n') {
      output += '\n';
      newline = true;
      return
    }

    var prestring = "";
    var poststring = item.string;

    //if this is a newline, we need to peel off any markdown formatting prefixes 
    //and output them outside the del/ins tags
    if (newline) {
      var match = item.string.match(PREFIX);
      if (match == null) 
        prestring ="";
      else
        prestring = match[0];

      poststring = item.string.substring(prestring.length);
    }

    //wrap ins and del strings with tags
    if (item.state == SDEL)
      output += prestring+'<del>' + poststring + '</del>';
    else if (item.state ==SINS) 
      output += prestring+'<ins>' + poststring + '</ins>';

    //and just output other strings
    else 
      output += prestring+poststring;

    newline = false;
  });
  return output;
  
}
