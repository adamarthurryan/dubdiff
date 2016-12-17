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



//initial state is rehydrated from the server
const initialState = window.__INITIAL_STATE__

console.log('initialState', initialState)

//create the redux store
//initial state is retrieved from localStore
const store = Redux.createStore(
  Redux.combineReducers(reducers), 
  initialState,
  Redux.compose(
    Redux.applyMiddleware(thunk),
    window.devToolsExtension ? window.devToolsExtension() : f => f
  )
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
  