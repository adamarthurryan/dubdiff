import express from 'express'
import path from 'path'
import bodyParser from 'body-parser'
import * as Redux from 'redux'

import fetch from 'isomorphic-fetch'

import comparisonRouter from './comparison'

import * as reducers from '../common/reducers'

import {Status, StatusError} from '../common/constants'

import render from './render'

// set use port 8080 for dev, 80 for production
const PORT = (process.env.NODE_ENV !== 'production' ? 8080 : 80)

const app = express()

// serve the dist static files at /dist
app.use('/dist', express.static(path.join(__dirname, '..', '..', 'dist')))

// serve the comparison api at /api/compare
app.use(bodyParser.json())
app.use('/api/compare', comparisonRouter)

// the following routes are for server-side rendering of the app
// we should render the comparison directly from the server
// this loading logic could be moved into ../common/actions because it is isomorphic
app.route('/:comparisonId')
  .get((req, res) => {
    const store = createSessionStore()
    const endpointUri = `http://localhost:${PORT}/api/compare/${req.params.comparisonId}`

    // fetch the comparison
    fetch(endpointUri)
    .then(response => {
      if (response.ok) {
        return response.json()
      } else {
        response.text().then(() => {
          const error = {message: `${response.status}: ${response.statusText}`}
          initAndRenderError(error, store, req, res)
        })
      }
    })
    .then(({a, b}) => {
      initAndRenderComparison({a, b}, store, req, res)
    })
    .catch(error => {
      initAndRenderError(error, store, req, res)
    })
  })
app.route('/')
  .get((req, res) => {
    render(createSessionStore(), req, res)
  })

app.listen(PORT, function () {
  console.log(`Server listening on port ${PORT}.`)
})

// creates the session store
function createSessionStore () {
  // create the redux store
  return Redux.createStore(
    Redux.combineReducers(reducers)
  )
}

function initAndRenderComparison ({a, b}, store, req, res) {
  store.dispatch({type: 'UPDATE_ORIGINAL_INPUT', data: a})
  store.dispatch({type: 'UPDATE_FINAL_INPUT', data: b})
  store.dispatch({type: 'STATUS_SET', data: Status.CLEAN})
  render(store, req, res)
}

function initAndRenderError (error, store, req, res) {
  store.dispatch({type: 'STATUS_SET', data: Status.EMPTY})
  store.dispatch({type: 'STATUS_SET_ERROR', data: StatusError.LOAD_ERROR, error})
  render(store, req, res)
}
