import * as JsDiff from 'diff'
import EditorsDiff from './EditorsDiff'

let plaintextDiffer = new EditorsDiff()
let markdownDiffer = new EditorsDiff(/([\s,.:]|[*\[\]\(\)])/)

//returns a comparison of the texts as plaintext
export function plaintextDiff(original, final) {
    let diff = plaintextDiffer.diff(original, final)
    return diff
}

//returns a comparison of the texts as markdown
export function markdownDiff(original, final) {
    let diff = markdownDiffer.diff(original, final)
    diff = rewriteMarkdownDiff(diff)

    return diff  
}

// returns a string version of the diff, with "{+ ... +}" and "[- ... -]"
// representing ins and del blocks
export function diffToString(diff, tags={added:{start:'{+', end:'+}'}, removed:{start:'[-', end:'-]'}, same:{start:'', end:''}}) {

  return diff.map(({added, removed, value}) => {

      let {start,end} = added ? tags.added : (removed ? tags.removed : tags.same)

      let string = value
      if (Array.isArray(value))
        string = value.join('')

      return start+string+end
  }).join('')
}

export function diffToHtml(diff) {
  return diffToString(diff, {added:{start:'<ins>', end:'</ins>'}, removed:{start:'<del>', end:'</del>'}, same:{start:'', end:''}})  
}


// Rewrites the given diff to correctly render as markdown, assuming the source
// documents were also valid markdown.
// In essence, moves the markdown formatting elements in or out of the inserted and deleted blocks, as appropriate

//rules:
// 1. if a multiline del block is followed by an ins block, 
//    the first line of the ins block should be inserted at the end of the first line of the del block
//    so the markdown will apply to the ins text as it should
// 2. after a newline, if an ins or del block begins with a markdown line formatting prefix (eg. for a title or list)
//    then that prefix should be moved out of the block

//not yet implemented rules:
// 3. if an ins or del block spans one half of a bold, italic or link string
//    eg. **Hello <del>World** I</del><ins>Darling** she</ins> said 
//    the block should be broken up to move the formatting code outside
//    OR the whole formatting string could be brought into the block
//    eg. **Hello <del>World</del><ins>Darling</ins>** <ins>I</ins><del>she</del> said
function rewriteMarkdownDiff(diff) {  
  //apply transformation rules
  let transformedDiff = diff
  transformedDiff= applyTransformationRule1(transformedDiff)
  transformedDiff= applyTransformationRule2(transformedDiff)
  return transformedDiff
}

//Transformation rule 1
// 1. if a multiline del block is followed by an ins block, 
//    the first line of the ins block should be inserted at the end of the first line of the del block
//    so the markdown will apply to the ins text as it should
function applyTransformationRule1(diff) {
  let transformedDiff = []

  const B_ADDED='added', B_REMOVED='removed', B_SAME='same'
  let previousBlockType = null 
  let currentBlockType = null
  let previousBlockWasMultiline = false
  let currentBlockIsMultiline = false

  //iterate the input tokens to create the intermediate representation
  diff.forEach((currentBlock) => {

    previousBlockType = currentBlockType
    previousBlockWasMultiline = currentBlockIsMultiline
    currentBlockType = (currentBlock.added ? B_ADDED : (currentBlock.removed ? B_REMOVED : B_SAME))
    currentBlockIsMultiline = isMultilineDiffBlock(currentBlock)

    //transform rule 1 applys when:
    // the previous block was a del and had multiple lines
    // the current block is an ins
    if (previousBlockType == B_REMOVED && currentBlockType == B_ADDED && previousBlockWasMultiline) {

      //split the first line from the current block
      let currentBlockSplit = splitMultilineDiffBlock(currentBlock)

      //pop the previous diff entry
      let previousBlock = transformedDiff.pop()

      //split the first line from the previous block
      let previousBlockSplit = splitMultilineDiffBlock(previousBlock)


      //now add the blocks back, interleaving del and ins blocks
      for (let i=0; i<Math.max(previousBlockSplit.length, currentBlockSplit.length); i++) {
        if (i<previousBlockSplit.length)
          transformedDiff.push(previousBlockSplit[i])
        if (i<currentBlockSplit.length)
          transformedDiff.push(currentBlockSplit[i])
      }
    }
    else {
      //otherwise, we just add the current block to the transformed list
      transformedDiff.push(currentBlock)
    }
  })

  return transformedDiff
}


// matches markdown prefixes that affect the formatting of the whole subsequent line
  // ^                  - start of line
  // ([ \t]*\>)*       - blockquotes (possibly nested)
  // (
  //  ([ \t]*#*)      - headers
  //  |([ \t]+[\*\+-])     - unordered lists
  //  |([ \t]+[0-9]+\.)  - numeric lists
  // )?
  // [ \t]*             - trailing whitespace
const MARKDOWN_PREFIX =  /^([ \t]*\>)*(([ \t]*#*)|([ \t]*[\*\+-])|([ \t]*[\d]+\.))?[ \t]*/

//matches strings that end with a newline followed by some whitespace
const NEWLINE_SUFFIX = /\n\s*$/

// transformation rule 2:
//    after a newline, if an ins or del block begins with a markdown line formatting prefix (eg. for a title or list)
//    then that prefix should be moved out of the block
//    also, if an ins block begins with a formatting prefix and follows immediately after a del block that follows a newline,
//    the prefix should be moved out of the block _and_ an extra newline character should be added to the beginning of it
function applyTransformationRule2(diff) {
  let transformedDiff = []

  let isNewline = true
  let newlineString = '\n'

  //iterate the input tokens to create the intermediate representation
  diff.forEach((currentBlock) => {

    if (isNewline && (currentBlock.added || currentBlock.removed) ) {
      let match = currentBlock.value.match(MARKDOWN_PREFIX)
      if (match) {
        let preBlock = {value:match[0]}
        let postBlock = {added:currentBlock.added, removed:currentBlock.removed, value:currentBlock.value.substring(match[0].length)}
        
        if (currentBlock.added) {
          let newlineBlock = {value: newlineString}
          transformedDiff.push(newlineBlock)
        }
        transformedDiff.push(preBlock)
        transformedDiff.push(postBlock)
      }
      else {
        transformedDiff.push(currentBlock)
      }
    }
    else {
      transformedDiff.push(currentBlock)
      isNewline = NEWLINE_SUFFIX.test(currentBlock.value)
      if (isNewline)
        newlineString = currentBlock.value.match(NEWLINE_SUFFIX)[0]
    }
  })

  return transformedDiff
}



//returns true if the given diff block contains a newline element
function isMultilineDiffBlock({value}) {
  return value.indexOf('\n') != -1
}


//returns an array of diff blocks that have the same added, removed fields as the given one
//but with the string split by newlines
//if the diff block has no newlines, an array containing only that diff will be returned
//if the diff block has newlines, the resulting array will have a series of blocks, 
// each of which subsequent to the first block will begin with a newline
//if the diff block begins with a newline, the returned array will begin with an empty diff
function splitMultilineDiffBlock({added, removed, value}) {
  //find the indices of the diff block that coorespond to newlines
  const splits = indicesOf(value, c => (c=='\n') )

  splits.push(value.length)

  //create a range from each index
  const ranges = splits.reduce(  
    //the accumulator is a structure with the last index and the list of ranges 
    //the ranges are a {start, end} structure 
    ({last, ranges}, i) => {
      ranges = ranges.concat([{start:last, end:i}])
      return {last:i, ranges}
    },
    //start with the zero index and an empty array 
    {last: 0, ranges:[]}
  ).ranges


  //map the ranges into blocks
  const blocks = ranges.map(
    //each block is the same as the given original block, but with the values split at newlines
    ({start, end}) => ({added, removed, value:value.substring(start, end)})
  )

  //console.log({value, splits, ranges, blocks})

  return blocks
}

//collect all the indices of the given string that satisfy the test function
const indicesOf = (string, test) => string.split('').reduce( 
  //add indexes that satisfy the test function to the array
  (acc, x, i) => (test(x) ? acc.concat([i]) : acc ), 
  //start with the empty array
  []
)
