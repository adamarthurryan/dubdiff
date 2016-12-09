
import {Diff} from 'diff'

const EditorsDiff = new Diff()

EditorsDiff.equals = function(left, right) {
  return (
    left.string == right.string 
  )
    
}
EditorsDiff.tokenize = function(value) {
  let tokens = value.split(/([ ]+)|(\n)/)
  let annotatedTokens = [] 
  tokens.forEach( token => {
    if (isSpace(token)) {
      if (annotatedTokens.length == 0)
        annotatedTokens.push({string:'', whitespace:[]})

      let last = annotatedTokens[annotatedTokens.length-1]
      last.whitespace.push(token)
    }
    else {
      annotatedTokens.push({string:token, whitespace:[]})
    }
  })
  console.log(annotatedTokens)
  return annotatedTokens
}
EditorsDiff.join = function (annotatedTokens) {
  let tokens = []
  annotatedTokens.forEach(annotatedToken => {
    tokens.push(annotatedToken.string)
    annotatedToken.whitespace.forEach(item => {
      tokens.push(item)
    })
  })

  console.log(tokens.join(''))
  return tokens.join('')
}

export default EditorsDiff

const isSpace = str => /[ ]+/.test(str)