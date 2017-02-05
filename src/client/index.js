import React from 'react'
import ReactDOM from 'react-dom'

import * as Redux from 'redux'

import {Provider} from 'react-redux'

// import  createBrowserHistory  from 'history/lib/createBrowserHistory'
import {Router, browserHistory} from 'react-router'

import thunk from 'redux-thunk'

import * as reducers from '../common/reducers'
import routes from '../common/routes'
import {Format} from '../common/constants'
import * as Actions from '../common/actions'

import LocalStorage from './LocalStorage'

// initial state is rehydrated from the server
const initialState = JSON.parse(decodeURI(window.__INITIAL_STATE__))

// create the redux store
// initial state is retrieved from localStore
const store = Redux.createStore(
  Redux.combineReducers(reducers),
  initialState,
  Redux.compose(
    Redux.applyMiddleware(thunk),
    window.devToolsExtension ? window.devToolsExtension() : f => f
  )
)

render()

//  read and init the hash after render:
//  because this parameter is passed as a hash, it isn't available on the server,
//  so the server initial render will be with plaintext, so we have to start with that.
//  lame. 
initFormatHash(store)
registerFormatListener(store)

// detect hash parameter for markdown/plaintext format and initialize store
function initFormatHash(store) {
  //  get the has from the window location
  let hash = window.location.hash.toUpperCase()
  //  strip the hash sign
  hash = hash.substring(1)

  // dispatch the appropriate action
  if (hash === Format.MARKDOWN)
    store.dispatch(Actions.setMarkdownFormat())
  else if (hash === Format.PLAINTEXT || hash === '')
    store.dispatch(Actions.setPlaintextFormat())
}

  // listen to changes in the redux store and update the url hash parameter when appropriate
function registerFormatListener(store) {

  function handleChange() {
    let nextFormat = store.getState().format;

    if (nextFormat === Format.MARKDOWN) 
      window.history.replaceState("", document.title, window.location.pathname+"#"+nextFormat);
    else if (nextFormat === Format.PLAINTEXT) {
      window.history.replaceState("", document.title, window.location.pathname);

    }
  }

  let unsubscribe = store.subscribe(handleChange);
  return unsubscribe;
}


function render () {
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


