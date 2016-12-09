/*eslint-env node, mocha */
/*global expect */
/*eslint no-console: 0*/
'use strict';

import chai from 'chai'

import {markdownDiff, diffToString} from '../src/common/util/dubdiff'

let diff = (a,b) => diffToString(markdownDiff(a,b))

const expect = chai.expect 

describe('dubdiff', () => {
  let db;  

  beforeEach(() => {
  });

  it('plaintext diffs consecutive words', ()=>{  
    expect(diff(
      'This is a smlb sentnce with no errors.',
      'This is a simple sentence with no errors.'
    )).to.equal('This is a [-smlb sentnce-] {+simple sentence+} with no errors.')
  })

  it('plaintext diffs with word deletion', ()=>{  
    expect(diff(
      'Gonna delete a word.',
      'Gonna delete word.'
    )).to.equal('Gonna delete [-a-] word.')
  })

  it('plaintext diffs with word insertion', ()=>{  
    expect(diff(
      'Gonna delete word.',
      'Gonna delete a word.'
    )).to.equal('Gonna delete {+a+} word.')
  })

  it('reorganizes insertions after multiline deletions', ()=>{
    expect(diff(
`# Title
other`,
`# Subtitle`
    )).to.equal('# [-Title-] {+Subtitle+}[-\nother-]')
  })
})