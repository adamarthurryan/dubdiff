var Path = require('path');

var srcRoot = Path.join(__dirname, '..')//.replace(/\\/g, "/")

//there should be some option for distribution / optimization?
var config =  {
  /* upgraded to babel 6 to be able to use this preset */
  presets: ["node6", "react"],
  sourceMaps: "both",
  //highlightCode: false,
  sourceRoot: srcRoot,
  only: /src/

};

require('babel-core/register')(config);


const PIPING = true

//!!! Need to guard for production environments
//if (process.env.NODE_ENV !== "production") {
if (PIPING)
  if (!require("piping")({hook: true, includeModules: false})) {
    return;
  }
//}

try {
  require('./index.js');
}
catch (error) {
  console.error(error.stack);
}
