
export const resetInput = () => ({ type: 'RESET_INPUT' })
export const updateOriginalInput = (text) => ({ type: 'UPDATE_ORIGINAL_INPUT', data:text})
export const updateFinalInput = (text) => ({ type: 'UPDATE_FINAL_INPUT', data:text})
export const setPlaintextFormat = () => ({ type: 'SET_PLAINTEXT_FORMAT'})
export const setMarkdownFormat = () => ({ type: 'SET_MARKDOWN_FORMAT'})
export const showOriginal = () => ({ type: 'SHOW_ORIGINAL'})
export const showFinal = () => ({ type: 'SHOW_FINAL'})
export const showDifference = () => ({ type: 'SHOW_DIFFERENCE'})
 