var Path = require('path')

var srcRoot = Path.join(__dirname, '..')

// there should be some option for distribution / optimization?
var config = {
  presets: ['node6', 'react'],
  // enable source maps for non-production instances
  sourceMaps: (process.env.NODE_ENV !== 'production' ? 'both' : false),
  // highlightCode: false,
  sourceRoot: srcRoot,
  only: /src/

}

require('babel-core/register')(config)

var piping = require('piping')

main()

function main () {
  // Enable piping for non-production environments
  if (process.env.NODE_ENV !== 'production') {
    // piping will return false for the initial invocation
    // the app will be run again in an instance managed by piping
    if (!piping({hook: true, includeModules: false})) {
      return
    }
  }

  try {
    require('./index.js')
  } catch (error) {
    console.error(error.stack)
  }
}
