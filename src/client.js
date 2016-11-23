import React from 'react'
import ReactDOM from 'react-dom'

import * as Redux from 'redux'

import {Provider} from 'react-redux'
import * as localStore from './localStore'

import * as reducers from './reducers'

import Main from './components/Main'


//create the redux store
//initial state is retrieved from localStore
const store = Redux.createStore(
  Redux.combineReducers(reducers), 
  localStore.get(),
  window.devToolsExtension ? window.devToolsExtension() : undefined
)

//save the state whenever the state changes
function saveState() {
  let state = store.getState()
  //pass the elements of state that should be persisted to the local store as an array of element name strings
  localStore.set(state, [])
}
store.subscribe(saveState)


function render() {
    ReactDOM.render(
    <Provider store={store}>
      <Main/>    
    </Provider>
  , document.getElementById('root'))
}

render()
  