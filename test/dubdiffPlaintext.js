/*eslint-env node, mocha */
/*global expect */
/*eslint no-console: 0*/
'use strict';

import chai from 'chai'

import {plaintextDiff, diffToString} from '../src/common/util/dubdiff'

let diff = (a,b) => diffToString(plaintextDiff(a,b))

const expect = chai.expect 

describe('dubdiff', () => {

  beforeEach(() => {
  });

  it('diffs single words', ()=>{  
    expect(diff(
      'This is a smlb sentence.',
      'This is a simple sentence.'
    )).to.equal('This is a [-smlb-] {+simple+} sentence.')
  })

  it('diffs consecutive words', ()=>{  
    expect(diff(
      'This is a smlb sentnce with no errors.',
      'This is a simple sentence with no errors.'
    )).to.equal('This is a [-smlb sentnce-] {+simple sentence+} with no errors.')
  })

  it('diffs with word deletion', ()=>{  
    expect(diff(
      'Gonna delete a word.',
      'Gonna delete word.'
    )).to.equal('Gonna delete [-a-] word.')
  })
  it('diffs with word insertion', ()=>{  
    expect(diff(
      'Gonna delete word.',
      'Gonna delete a word.'
    )).to.equal('Gonna delete {+a+} word.')
  })
  it('diffs accross newline without weird spaces', () => {
    expect(diff(
      'This is a flawed\ncomment',
      'This is a corrected\nitem'
    )).to.equal('This is a [-flawed-] {+corrected+}\n[-comment-] {+item+}')
  })
  it('doesn\'t add spaces after newline', () => {
    expect(diff(
      '\nhere',
      '\nhere'
    )).to.equal('\nhere')
  })
  it('doesn\'t add spaces before newline', () => {
    expect(diff(
      'there\n',
      'there\n'
    )).to.equal('there\n')
  })
})