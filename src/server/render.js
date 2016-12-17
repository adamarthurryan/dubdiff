import React from 'react'
import { renderToString } from 'react-dom/server'
import { Provider } from 'react-redux'
import { match, RouterContext } from 'react-router'

import routes from '../common/routes.js'


export default function render(store, req, res) {
  // Send the rendered page back to the client
  match({ routes, location: req.url }, (error, redirectLocation, renderProps) => {
    if (error) {
      res.status(500).send(renderError('Routing Error:', error.message))
    } else if (redirectLocation) {
      res.redirect(302, redirectLocation.pathname + redirectLocation.search)
    } else if (renderProps) {
      // Render the component to a string
      try {
        const html = renderToString(
          <Provider store={store}>
            <RouterContext {...renderProps} />    
          </Provider>
        )

        // Grab the initial state from our Redux store
        const initialState = store.getState()
        // and send
        res.status(200).send(appTemplate(html, initialState))
      }
      catch(ex) {
        console.log("Render Exception:",ex)
        res.status(500).send(errorTemplate('Render Exception', ex.message, ex))
      }

    } else {
      res.status(404).send(errorTemplate('Not found', `${req.url} not found.`))
    }
  })
}

const pageTemplate = (body) => {
    return `
      <!doctype html>
      <html>
        <head>
          <title>Dubdiff</title>

          <!-- CSS -->
          <link rel="stylesheet" href="dist/semantic.min.css"/>
          <link rel="stylesheet" href="dist/main.css"/> 

          <!-- Favicon -->
          <link rel="icon" type="image/png" sizes="32x32" href="dist/favicon-32x32.png">
          <link rel="icon" type="image/png" sizes="96x96" href="dist/favicon-96x96.png">
          <link rel="icon" type="image/png" sizes="16x16" href="dist/favicon-16x16.png">


        </head>
        <body>
          ${body}
        </body>
      </html>
    `
}

function errorTemplate(title, message, exception) {
  return pageTemplate(`
    <h1>${title}</h1>
    <p>${message}</p>
    ${exception ? 
      `<pre>${exception.toString()}</pre>`:
      ``
    }
  `)
}



function appTemplate(html, initialState) {
    return pageTemplate(`
      <div id="root">${html}</div>

      <script>
        window.__INITIAL_STATE__ = ${JSON.stringify(initialState)}
      </script>
      <!-- <script>__REACT_DEVTOOLS_GLOBAL_HOOK__ = parent.__REACT_DEVTOOLS_GLOBAL_HOOK__</script> -->
      <script type="text/javascript" src="dist/browser-bundle.js"></script>
    `)
}
