import React from 'react'
import ReactDOM from 'react-dom'

import * as Redux from 'redux'

import {Provider} from 'react-redux'
import * as localStore from './localStore'

import * as reducers from './reducers'

import Main from './components/Main'
import Compare from './components/Compare'

import { Router } from 'react-router'
import  createBrowserHistory  from 'history/lib/createBrowserHistory'
import  {Route, IndexRoute, Redirect } from 'react-router'


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
            <Route path="/" component={Main}  />
            <Route path="/**" component={Compare}/>
        </Router>
    </Provider>
  , document.getElementById('root'))
}

render()
  