import express from 'express'
import path from 'path'
import bodyParser from 'body-parser'
import * as Redux from 'redux'

import comparisonRouter from './comparison'


import * as reducers from '../common/reducers'
import * as actions from '../common/actions'

import render from './render'

const app = express()

//serve the dist static files at /dist
app.use('/dist', express.static(path.join(__dirname, '..', '..', 'dist')))
 
//serve the comparison api at /api/compare
app.use(bodyParser.json())
app.use('/api/compare', comparisonRouter);



//the following routes are for server-side rendering of the app

//eventually, we should render the comparison directly from the server
/*
app.route('/:comparisonId')
  .get((req, res) => {
    const store = createSessionStore()
    ...

  })
app.route('/'). ...
*/


//but for now, let's just render the app and let it fetch comparison data
app.use((req, res) => render(createSessionStore(), req, res))

app.listen(8080, function () {
  console.log('Server listening on port 8080.')
})


//this is pretty much redundant at this point
function createSessionStore() {
  //create the redux store
  return Redux.createStore(
    Redux.combineReducers(reducers)
  )
}





//router.get('/', controller.index);
