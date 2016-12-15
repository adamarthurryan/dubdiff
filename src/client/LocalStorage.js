import React from 'react'
import {connect} from 'react-redux'


import * as Actions from '../common/actions'
import * as Selectors from '../common/selectors'


/* This component reads the local storage store and adds them to the Redux store.
 * Local storage is read during the componentDidMount lifecycle method.
 * Local storage is written during the componentWillReceiveProps lifecycle method.
*/

//an app-specific name for the localStorage state
const stateName = "dubdiff_state"

//return a new object with the given keys, each assigned to the cooresponding value
//from the given object
const copyKeys = (obj, keys) => keys.reduce((acc, p)=>{acc[p]=obj[p]; return acc}, {})

console.log(copyKeys({a:1, b:2}, ['a']))
console.log(copyKeys({}, ['a']))

//utility method for retrieving json data from the local store
function getLocalState (keys) {
  if (localStorage.getItem(stateName)) {
    const localState = JSON.parse(localStorage.getItem(stateName))
    return copyKeys(localState, keys)
  }
  else
    return copyKeys({}, keys)
} 

//utility method for writing json data to the local store
function setLocalState (state, keys) {
  let toSave = copyKeys(state, keys)
  localStorage.setItem(stateName, JSON.stringify(toSave))
}


const mapStateToProps = (state) => ({
  input: state.input,
  //the loading/empty/clean state
})

  
const mapDispatchToProps = dispatch => ({
  onChangeOriginal: (text) => dispatch(Actions.updateOriginalInput(text)),
  onChangeFinal: (text) => dispatch(Actions.updateFinalInput(text)),
})


class LocalStorage extends React.Component {
  
  //load the state from the local storage
  componentDidMount() {
    //only if the status is EMPTY
    if (this.props.input.original=='' && this.props.input.final == '') {
      const localState = getLocalState(['input'])
      if (localState.input && localState.input.original)
        this.props.onChangeOriginal(localState.input.original)
      if (localState.input && localState.input.final) 
        this.props.onChangeFinal(localState.input.final)
    }
  }
  //save the state to local storage
  componentWillReceiveProps(nextProps) {
    setLocalState(nextProps, ['input'])
  }

  render () { 
    return this.props.children
  } 
}

export default connect(mapStateToProps, mapDispatchToProps)(LocalStorage)

