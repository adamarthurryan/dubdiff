import React from 'react'
import ReactDOM from 'react-dom'

import * as Redux from 'redux'

import {Provider} from 'react-redux'

import  createBrowserHistory  from 'history/lib/createBrowserHistory'
import  {Router, Route, IndexRoute, Redirect } from 'react-router'

import * as localStore from '../common/localStore'
import * as reducers from '../common/reducers'
import routes from '../common/routes'


//create the redux store
//initial state is retrieved from localStore
const store = Redux.createStore(
  Redux.combineReducers(reducers), 
  localStore.get("dubdiff"),
  window.devToolsExtension ? window.devToolsExtension() : undefined
)

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
        <Router history={createBrowserHistory()}>
            {routes}
        </Router>
    </Provider>
  , document.getElementById('root'))
}

render()
  