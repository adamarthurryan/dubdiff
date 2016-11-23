//per http://redux.js.org/docs/recipes/ComputingDerivedData.html

import { createSelector } from 'reselect'

const input = (state) => state.input

export const safeInput = createSelector(
  [input],
  (input) => {
    //!!! sanitize the input here and return
    return input
  }
)