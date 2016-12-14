import {Format, Show} from './constants'


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

export function compare (state, action ) {
  switch (action.type) {
    case 'UPDATE_ORIGINAL_COMPARE':
      return Object.assign({}, state, {original:action.data})
    case 'UPDATE_FINAL_COMPARE':
      return Object.assign({}, state, {final:action.data})
    case 'CLEAR_COMPARE':
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


export function saveStatus (state, action) {
  switch (action.type) {
    case 'SAVE_STATUS_DIRTY':
      return {dirty:true, id:null}
    case 'SAVE_STATUS_EMPTY':
      return {dirty:false, id:null}
    case 'SAVE_STATUS_SAVED':
      return Object.assign({}, state, {waiting: false, dirty:false, failed: false, error:null})
    case 'SAVE_STATUS_FAILED' :
      return Object.assign({}, state, {waiting: false, failed: true, error: action.error})
    case 'SAVE_STATUS_WAITING' :
      return Object.assign({}, state, {waiting: true, failed: false, error: null })
    case 'SAVE_STATUS_ASSIGN_ID':
      return Object.assign({}, state, {id: action.id})
    default:
      return state || {empty: true, dirty:false, id:null}
  }
}