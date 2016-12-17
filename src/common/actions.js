import fetch from 'isomorphic-fetch'
import uuid from 'uuid/v4'
import {browserHistory} from 'react-router'
import {Status, StatusError} from './constants'

//All state transitions in the app happen in these methods
//this includes redux state changes, asyncronous data requests, and browser location changes

export const updateOriginalInput = (text) => 
  (dispatch, getState) => {
    dispatch({type: 'UPDATE_ORIGINAL_INPUT', data:text})
    if (getState().input.original.length>0)
      dispatch({type: 'STATUS_SET', data:Status.DIRTY})
    else 
      dispatch({type: 'STATUS_SET', data:Status.EMPTY})
  }

export const updateFinalInput = (text) => 
  (dispatch, getState) => {
    dispatch({ type: 'UPDATE_FINAL_INPUT', data:text})
    if (getState().input.final.length>0)
      dispatch({type: 'STATUS_SET', data:Status.DIRTY})
    else 
      dispatch({type: 'STATUS_SET', data:Status.EMPTY})
  }

export const clearInput = () =>
  (dispatch) => {
    dispatch({type: 'CLEAR_INPUT'})
    dispatch({type: 'STATUS_SET', data:Status.EMPTY})
  }

export const setPlaintextFormat = () => ({ type: 'SET_PLAINTEXT_FORMAT'})
export const setMarkdownFormat = () => ({ type: 'SET_MARKDOWN_FORMAT'})
export const showOriginal = () => ({ type: 'SHOW_ORIGINAL'})
export const showFinal = () => ({ type: 'SHOW_FINAL'})
export const showDifference = () => ({ type: 'SHOW_DIFFERENCE'})


//if the input is dirty, saves it to the server
//creates a new uuid for the same, 
//then changes the browser location to a comparison view with that id
export const compare = () => 
  (dispatch, getState) => {
    //!!! could test that the input is dirty before triggering a save
    //if the input is empty, the compare should do nothing
    //if the input is clean, the compare should not save and keep using the same id

    //start saving the input to the server
    const id = dispatch(save())

    //we can use the id created by the save method to build a path
    const comparePath = `/${id}`
    browserHistory.replace(comparePath)
  }


//clear the input and return to the edit page
export const reset = () => 
  (dispatch, getState) => {
    dispatch(clearInput())
    browserHistory.push('/')
  }


//switch to the edit view
export const edit = () => 
  (dispatch, getState) => {
    browserHistory.push('/')
  }


//saves the current input fields to the server
//creates and returns a new id for the comparison
//should this method ensure that the initial state is valid? ('DIRTY')
export const save = () =>
  (dispatch, getState) => {

    //generate an id
    const id = uuid()

    //set waiting state
    dispatch( {type: 'STATUS_SET', data:Status.SAVING})

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
        dispatch({type: 'STATUS_SET', data: Status.CLEAN})
      })
      .catch(error => {
        dispatch({type: 'STATUS_SET', data: Status.DIRTY})
        dispatch({type: 'STATUS_SET_ERROR', data: StatusError.SAVE_ERROR, error})
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