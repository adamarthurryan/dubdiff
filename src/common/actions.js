import fetch from 'isomorphic-fetch'
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

export const setPlaintextFormat = () => ({ type: 'SET_PLAINTEXT_FORMAT'})
export const setMarkdownFormat = () => ({ type: 'SET_MARKDOWN_FORMAT'})
export const showOriginal = () => ({ type: 'SHOW_ORIGINAL'})
export const showFinal = () => ({ type: 'SHOW_FINAL'})
export const showDifference = () => ({ type: 'SHOW_DIFFERENCE'})


//saves the current input fields to the server
//creates and returns a new id for the 
export const save = () =>
  (dispatch, getState) => {

    //generate an id
    const id = uuid()

    //set waiting state
    dispatch( {type: 'SAVE_STATUS_WAITING'})

    const endpointUri = `/api/compare/${id}`
    const fetchOptions = {
      method: 'POST',
      body: JSON.stringify({
        a: getState().input.original,
        b: getState().input.final
      }),
      headers: {
        "Content-Type": "application/json"
      },
    }


    //dispatch post request
    fetch(endpointUri, fetchOptions)
      .then(response => {
        dispatch( {type: 'SAVE_STATUS_SAVED'})
      })
      .catch(error => {
        dispatch( {type: 'SAVE_STATUS_FAILED', error})
      })

    //return the id after the request has been sent
    return id;
  }

/*
const load = (id) =>
  (dispatch, getState) => {

    //set waiting state
    dispatch( {type: 'SAVE_STATUS_WAITING'})

    const endpointUri = `/api/compare/${id}`
    const fetchOptions = {
      method: 'GET'
    }


    //dispatch post request
    fetch(endpointUri, fetchOptions)
      .then(response => response.json())
      .then(json => {
        dispatch( {type: 'UPDATE_ORIGINAL_INPUT', data:json.a})
        dispatch( {type: 'UPDATE_FINAL_INPUT', data:json.b})
        dispatch( {type: 'LOAD_STATUS_LOADED'})
      })
      .catch(error => {
        dispatch( {type: 'LOAD_STATUS_FAILED', error})
      })

    //return the id after the request has been sent
    return id;

  }

export const loadIfNeeded = (id) =>
  (dispatch, getState) => {
    if
  }
*/