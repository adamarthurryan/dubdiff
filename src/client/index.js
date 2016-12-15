import React from 'react'
import ReactDOM from 'react-dom'

import * as Redux from 'redux'

import {Provider} from 'react-redux'

//import  createBrowserHistory  from 'history/lib/createBrowserHistory'
import  {Router, Route, IndexRoute, Redirect, browserHistory } from 'react-router'

import thunk from 'redux-thunk'

import * as localStore from '../common/localStore'
import * as reducers from '../common/reducers'
import routes from '../common/routes'
import * as Actions from '../common/actions'



//the localStore implementation is naive
//initial state should be rehydrated from the server
//then additional state transformations should be applied based on localStore contents
// (or not? maybe localStore is not needed)

const initialState = window.__INITIAL_STATE__


//create the list of middlewares
let middlewares = [thunk]

//create the redux store
//initial state is retrieved from localStore
const store = Redux.createStore(
  Redux.combineReducers(reducers), 
  initialState,
  window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ ?
    window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__(Redux.applyMiddleware(...middlewares)):
    Redux.applyMiddleware(...middlewares)
)

//this way of reading local input isn't working:
// it's just overriding what comes from the server
// and it's not respecting the comparison that is loaded from the server

/*
const localInput = localStore.get('dubdiff')
if (localInput.input) {
  //dispatch localStore data to store
  store.dispatch(Actions.updateOriginalInput(localInput.input.original))
  store.dispatch(Actions.updateFinalInput(localInput.input.final))
  //should this be done after the first render?
}
*/

//save the state whenever the state changes
function saveState() {
  let state = store.getState()
  //pass the elements of state that should be persisted to the local store as an array of element name strings
  localStore.set(state, ["input"], "dubdiff") 
}
store.subscribe(saveState)


function render() {
    ReactDOM.render(
    <Provider store={store}>
        <Router history={browserHistory}>
            {routes}
        </Router>
    </Provider>
  , document.getElementById('root'))
}

render()
  