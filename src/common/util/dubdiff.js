import * as JsDiff from 'diff'


//!!! this deal with adding and removing spaces could be done more elegantly by 
// diffing on an array of simple data structures that contain the text and the adjacent space
// the diff would use a custom compare function that would disregard the spaces
// alternately, the text could be split with the spaces included in the array and then compared with a 
// custom diff function that would treat the space elements as null/ignored

//the current mechanism for adding and removing spaces is fragile and broken
export function plaintextDiff(original, final) {
    let arrOriginal = plaintextSplit(original)
    let arrFinal = plaintextSplit(final)

    let diff = JsDiff.diffArrays(arrOriginal, arrFinal)
    diff = plaintextRestoreSpaces(diff)

    return diff
}

export function markdownDiff(original, final) {
    let arrOriginal = plaintextSplit(original)
    let arrFinal = plaintextSplit(final)

    let diff = JsDiff.diffArrays(arrOriginal, arrFinal)
    diff = plaintextRestoreSpaces(diff)
    diff = rewriteMarkdownDiff(diff)

    return diff  
}

// returns a string version of the diff, with "{+ ... +}" and "[- ... -]"
// representing ins and del blocks
export function diffToString(diff) {
  return diff.map(({added, removed, value}) => {
      let start = added ? '{+' : removed ? '[-' : ''
      let end = added ? '+}' : removed ? '-]' : ''
      let string = value
      if (Array.isArray(value))
        string = value.join('')

      return start+string+end
  }).join(' ')
}

let plaintextSplit = text =>text.split(/[ ]|(\n)/)

function plaintextRestoreSpaces (diff) {
  return diff.map(({added, removed, value}) => ({
    added, 
    removed, 
    value:value.map((str, idx, arr) => (
      (str!='\n' && (idx<arr.length-1)) ? str+" " : str)
    )
  }))
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
  //transformedDiff= applyTransformationRule2(transformedDiff)
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
      console.log('trigger rule 1')

      //split the first line from the current block
      let currentBlockSplit = splitMultilineDiffBlock(currentBlock)

      //pop the previous diff entry
      let previousBlock = transformedDiff.pop()

      //split the first line from the previous block
      let previousBlockSplit = splitMultilineDiffBlock(previousBlock)

      console.log({currentBlock, currentBlockSplit, previousBlock, previousBlockSplit})

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

function applyTransformationRule2(diff) {
  // we need to find markdown prefixes that should be pulled out of added/removed blocks to the start of the line
  // prefixes are matched as follows:
    // ^                  - start of line
    // ([ \t]*\>)*       - blockquotes (possibly nested)
    // (
    //  ([ \t]*#*)      - headers
    //  |([ \t]+[\*\+-])     - unordered lists
    //  |([ \t]+[0-9]+\.)  - numeric lists
    // )?
    // [ \t]*             - trailing whitespace
  const PREFIX =  /^([ \t]*\>)*(([ \t]*#*)|([ \t]*[\*\+-])|([ \t]*[\d]+\.))?[ \t]*/

  let transformedDiff = []
  return transformedDiff


  /// ...
  /*
  transform.forEach(function(item) {
    //newlines are undecorated
    if (item.string == '\n') {
      output += '\n';

      //flag the new line
      newline = true;
      //and record the offset in the output string
      newlineIndex = output.length;
      return
    }

    //wrap del strings with tags
    if (item.state == SDEL) {
      output += '<del>' + item.string + '</del>';
      //del doesn't reset the newline state
    }

    //ins strings have to be handled a little differently:
    //if this is an ins just after a newline, or after a del after a newline, 
    //we need to peel off any markdown formatting prefixes and insert them at the beginning of the line outside the del/ins tags
    else if (item.state == SINS && newline) {
      var prestring, poststring;
      var match = item.string.match(PREFIX);
      if (match == null)
        prestring ="";
      else
        prestring = match[0];

      poststring = item.string.substring(prestring.length);

      output = output.substring(0, newlineIndex) + prestring + output.substring(newlineIndex);
      output += '<ins>' + poststring + '</ins>';
      newline = false;
      newlineIndex = -1;

    }

    else if (item.state == SINS) {
      output += '<ins>' + item.string + '</ins>';
    }

    //and just output other strings
    else {
      output += item.string;
      //this resets the newline state
      newline = false;
      newlineIndex = -1;
    }

  });
*/

}



//returns true if the given diff block contains a newline element
function isMultilineDiffBlock({value}) {
  return value.find(word => word == '\n')
}


//returns an array of diff blocks that have the same added, removed fields as the given one
//but with the array of words split by newlines
//if the diff block has no newlines, an array containing only that diff will be returned
//if the diff block has newlines, the resulting array will have a series of blocks, 
// each of which subsequent to the first block will begin with a newline
//if the diff block begins with a newline, the returned array will begin with an empty diff
function splitMultilineDiffBlock({added, removed, value}) {
  //find the indices of the diff block that coorespond to newlines
  const splits = findIndicesOf(value, str => str=='\n')

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
    ({start, end}) => ({added, removed, value:value.slice(start, end)})
  )

  console.log({value, splits, ranges, blocks})

  return blocks
}

//collect all the indices of the given array that satisfy the test function
const findIndicesOf = (array, test) => array.reduce( 
  //add indexes that satisfy the test function to the array
  (acc, x, i) => (test(x) ? acc.concat([i]) : acc ), 
  //start with the empty array
  []
)
