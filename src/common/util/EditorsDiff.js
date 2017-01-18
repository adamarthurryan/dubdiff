
import {Diff} from 'diff'

// EditorsDiff is a custom Diff implementation from the jsdiff library
// It allows diffing by phrases. Whitespace is ignored for the purpose of comparison,
// but is preserved and included in the output.

const TOKEN_BOUNDARYS = /([\s,.:])/

class EditorsDiff extends Diff {
  constructor (tokenBoundaries = TOKEN_BOUNDARYS) {
    super()
    this.tokenBoundaries = tokenBoundaries
  }

  equals (left, right) {
    return (
      left.string === right.string
    )
  }

  // splits the input string into a series of word and punctuation tokens
    // each token is associated with an optional trailing array of spaces
  tokenize (value) {
    let tokens = value.split(this.tokenBoundaries)
    let annotatedTokens = []
    tokens.forEach(token => {
      if (isSpace(token)) {
        if (annotatedTokens.length === 0) {
          annotatedTokens.push({string: '', whitespace: []})
        }

        let last = annotatedTokens[annotatedTokens.length - 1]
        last.whitespace.push(token)
      } else {
        annotatedTokens.push({string: token, whitespace: []})
      }
    })

    // this final empty token is necessary for the jsdiff diffing engine to work properly
    annotatedTokens.push({string: '', whitespace: []})
    return annotatedTokens
  }
  join (annotatedTokens) {
    let tokens = []
    annotatedTokens.forEach(annotatedToken => {
      tokens.push(annotatedToken.string)
      annotatedToken.whitespace.forEach(item => {
        tokens.push(item)
      })
    })
    return tokens.join('')
  }
}

export default EditorsDiff

const isSpace = str => /[ ]+/.test(str)
const isNewline = str => /[\n]+/.test(str)
