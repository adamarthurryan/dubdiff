import * as JsDiff from 'diff'


export function plaintextDiff(original, final) {


    let arrOriginal = plaintextSplit(original)
    let arrFinal = plaintextSplit(final)

    let diff = JsDiff.diffArrays(arrOriginal, arrFinal)
    diff = plaintextRestoreSpaces(diff)

    return diff

//    return JsDiff.diffWordsWithSpace(original,final)


//    let diff = JsDiff.diffLines(original.replace(/ /g, '###\n'), final.replace(/ /g, '###\n'))
//    console.log(diff, diff.map(({added, removed, value})=>({added, removed, value:value.replace(/###\n/g, ' ')})))
//    return diff.map(({added, removed, value})=>({added, removed, value:value.replace(/###\n/g, ' ')}))
}


export function diffToLogString(diff) {
  return diff.map(({added, removed, value}) => {
      let sym = added ? "+" : removed ? '-' : '/'
      return sym+value+sym
  })
}

let plaintextSplit = text =>text.split(/[ ]|(\n)/)
function plaintextRestoreSpaces (diff) {
  return diff.map(({added, removed, value}) => ({
    added, 
    removed, 
    value:value.map((str, idx, arr) => (
      (str!='\n' && (idx<arr.length-1)) ? str+" " : str)
    ).join('')
  }))
}