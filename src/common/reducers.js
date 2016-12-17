import {Format, Show, Status, StatusError} from './constants'


export function input (state, action ) {
  switch (action.type) {
    case 'UPDATE_ORIGINAL_INPUT':
      return Object.assign({}, state, {original:action.data})
    case 'UPDATE_FINAL_INPUT':
      return Object.assign({}, state, {final:action.data})
    case 'CLEAR_INPUT':
        return {original:'', final:''}
    default:
      return state || {original:'', final:''}
  }
}

export function format (state, action) {
  switch (action.type) {
    case 'SET_PLAINTEXT_FORMAT':
      return Format.PLAINTEXT
    case 'SET_MARKDOWN_FORMAT':
      return Format.MARKDOWN
    default:
      return state || Format.PLAINTEXT
  }
} 


export function show (state, action) {
  switch (action.type) {
    case 'SHOW_ORIGINAL':
      return Show.ORIGINAL
    case 'SHOW_FINAL':
      return Show.FINAL
    case 'SHOW_DIFFERENCE':
      return Show.DIFFERENCE
    default:
      return state || Show.DIFFERENCE
  }
}

/*
export function saveStatus (state, action) {
  switch (action.type) {
    case 'SAVE_STATUS_DIRTY':
      return {dirty: true}
    case 'SAVE_STATUS_EMPTY':
      return {dirty: false, empty: true}
    case 'SAVE_STATUS_SAVED':
      return {dirty: false, saved: true}
    case 'SAVE_STATUS_FAILED' :
      return Object.assign({}, state, {waiting: false, failed: true, error: action.error})
    case 'SAVE_STATUS_WAITING' :
      return Object.assign({}, state, {waiting: true, failed: false, error: null})
    default:
      return state || {empty: true, dirty:false}
  }
}
*/

//tracks status of the app, especially with respect to loaded and saved user data
export function status (state, action) {
  //the status or error type is valid if it is in the list of Status or StatusError types
  const isValidStatus = (type) => Status[type] == type
  const isValidError = (type) => StatusError[type] == type

  //the error is cleared when status changes
  if (action.type == 'STATUS_SET' && isValidStatus(action.data))
    return {type:action.data, error: null, hasError: false, errorType: null}
  //the error is set in addition to the status
  else if (action.type == 'STATUS_SET_ERROR' && isValidError(action.data))
    return Object.assign({}, state, {error: action.error, hasError: true, errorType:action.data})
  else
    return {type:Status.EMPTY, hasError: false, error:null}
}
