import express from 'express'
import path from 'path'
import bodyParser from 'body-parser'
import * as Redux from 'redux'

import fetch from 'isomorphic-fetch'

import comparisonRouter from './comparison'


import * as reducers from '../common/reducers'
import * as actions from '../common/actions'

import render from './render'

const PORT = 8080

const app = express()

//serve the dist static files at /dist
app.use('/dist', express.static(path.join(__dirname, '..', '..', 'dist')))
 
//serve the comparison api at /api/compare
app.use(bodyParser.json())
app.use('/api/compare', comparisonRouter);



//the following routes are for server-side rendering of the app

//we should render the comparison directly from the server

//this is garbage, we should use a robust method for loading comparisons, parallel to how saving works
//comparisons should be loaded isomorphically
app.route('/:comparisonId')
  .get((req, res) => {

    const store = createSessionStore()
    
    //fetch the comparison
    fetchComparison(req.params.comparisonId)
      .then( ({a,b}) => {
        store.dispatch({type: 'UPDATE_ORIGINAL_INPUT', data: a})
        store.dispatch({type: 'UPDATE_FINAL_INPUT', data: b})
        render(store, req, res)
      })
      .catch( error => {
        //... what to do here?
        console.log(`Error fetching comparison with id ${req.params.comparisonId}`, error)
      })

  })
app.route('/')
  .get((req, res) => {
    render(createSessionStore(), req, res)
  })


app.listen(PORT, function () {
  console.log('Server listening on port 8080.')
})


//creates the session store
function createSessionStore() {
  //create the redux store
  return Redux.createStore(
    Redux.combineReducers(reducers)
  )
}


function fetchComparison(id) {
  const endpointUri = `http://localhost:${PORT}/api/compare/${id}`
  const fetchOptions = {
    method: 'GET'
  }
 
  //dispatch post request
  return fetch(endpointUri, fetchOptions)
    .then(response => response.json())
}


//router.get('/', controller.index);
