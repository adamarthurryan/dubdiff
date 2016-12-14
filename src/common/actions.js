import requestPromise from 'request-promise-native'
import uuid from 'uuid/v4'

export const updateOriginalInput = (text) => 
  (dispatch, getState) => {
    dispatch({ type: 'UPDATE_ORIGINAL_INPUT', data:text})
    if (getState().input.original.length>0)
      dispatch({type: 'SAVE_STATUS_DIRTY'})
    else 
      dispatch({type: 'SAVE_STATUS_EMPTY'})
  }
export const updateFinalInput = (text) => 
  (dispatch, getState) => {
    dispatch({ type: 'UPDATE_FINAL_INPUT', data:text})
    if (getState().input.final.length>0)
      dispatch({type: 'SAVE_STATUS_DIRTY'})
    else 
      dispatch({type: 'SAVE_STATUS_EMPTY'})
  }

export const clearInput = () =>
  (dispatch) => {
    dispatch({ type: 'CLEAR_INPUT'})
    dispatch({ type: 'SAVE_STATUS_EMPTY'})
  }

export const updateOriginalCompare = (text) => ({ type: 'UPDATE_ORIGINAL_COMPARE', data:text})
export const updateFinalCompare = (text) => ({ type: 'UPDATE_FINAL_COMPARE', data:text})
export const clearCompare = () => ({ type: 'CLEAR_COMPARE'})
export const setPlaintextFormat = () => ({ type: 'SET_PLAINTEXT_FORMAT'})
export const setMarkdownFormat = () => ({ type: 'SET_MARKDOWN_FORMAT'})
export const showOriginal = () => ({ type: 'SHOW_ORIGINAL'})
export const showFinal = () => ({ type: 'SHOW_FINAL'})
export const showDifference = () => ({ type: 'SHOW_DIFFERENCE'})

export const save = () =>
  (dispatch, getState) => {

    console.log("!!! SAVING")

    //generate an id
    const id = uuid()
    dispatch( {type: 'SAVE_STATUS_ASSIGN_ID', id})

    //set waiting state
    dispatch( {type: 'SAVE_STATUS_WAITING'})

    const reqOptions = {
      method: 'POST',
      uri: `${location.origin}/api/compare/${id}`,
      body: {
        a: getState().input.original,
        b: getState().input.final
      },
      json: true
    }

    //dispatch post request
    requestPromise(reqOptions)
      .then(returnBodyJson => {
        dispatch( {type: 'SAVE_STATUS_SAVED'})
      })
      .catch(error => {
        dispatch( {type: 'SAVE_STATUS_FAILED', error})
      })
  }