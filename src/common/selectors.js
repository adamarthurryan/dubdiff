//per http://redux.js.org/docs/recipes/ComputingDerivedData.html

import { createSelector } from 'reselect'

import React from 'react'


import {Format, Show} from './constants'

import * as Dubdiff from './util/dubdiff'


const input = (state) => state.input
const format = (state) => state.format
const show = (state) => state.show 

export const safeInput = createSelector(
  [input],
  (input) => {
    //!!! sanitize the input here and return
    return input
  }
)

export const isMarkdownFormat = createSelector(
  [format],
  (format) => {
    return format == Format.MARKDOWN
  }
)

const isShow = (type) => createSelector(
  [show],
  (show) => {
    return show == type
  }
)

export const isShowOriginal = isShow(Show.ORIGINAL)
export const isShowFinal = isShow(Show.FINAL)
export const isShowDifference= isShow(Show.DIFFERENCE)


export const diff = createSelector(
  [format, safeInput],
  (format, safeInput) => {
    return Dubdiff.plaintextDiff(safeInput.original, safeInput.final)
/*
    let diff = JsDiff.diffWords (input.original.replace(/ /g, ' '), input.final.replace(/ /g, ' '))
    return diff.map(({added, removed, value})=>({added, removed, value:value.replace(/ /g, ' ')})).map(part => (
      part.added ? <ins>{part.value}</ins> :
      part.removed ? <del>{part.value}</del> :
      <span>{part.value}</span> 
    ))
*/ 
  }
)



/*
  html diff
  ---

  diffHtml(parentOriginal, parentFinal) {
    create stringOriginal, stringFinal consisting of 
  }
  */