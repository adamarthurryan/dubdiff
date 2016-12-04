

export function input (state, action ) {
  switch (action.type) {
    case 'UPDATE_ORIGINAL_INPUT':
      return Object.assign({}, state, {original:action.data})
    case 'UPDATE_FINAL_INPUT':
      return Object.assign({}, state, {final:action.data})
    case 'RESET_INPUT':
        return {original:'', final:''}
    default:
      return state || {original:'', final:''}
  }
}

export const Format = {
  PLAINTEXT: 'PLAINTEXT',
  MARKDOWN: 'MARKDOWN'
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

export const Show = {
  ORIGINAL:'ORIGINAL',
  FINAL:'FINAL',
  DIFFERENCE:'DIFFERENCE'
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
