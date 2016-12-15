import React from 'react'
import ReactDOM from 'react-dom'

import * as Redux from 'redux'

import {Provider} from 'react-redux'

//import  createBrowserHistory  from 'history/lib/createBrowserHistory'
import  {Router, Route, IndexRoute, Redirect, browserHistory } from 'react-router'

import thunk from 'redux-thunk'

import * as reducers from '../common/reducers'
import routes from '../common/routes'
import * as Actions from '../common/actions' 

import LocalStorage from './LocalStorage'



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






function render() {
    ReactDOM.render(
    <Provider store={store}>
      <LocalStorage >
        <Router history={browserHistory}>
            {routes}
        </Router>
      </LocalStorage>
    </Provider>
  , document.getElementById('root'))
}

render()
  