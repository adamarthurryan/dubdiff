/*eslint-env node, mocha */
/*global expect */
/*eslint no-console: 0*/
'use strict';

import chai from 'chai'

import {markdownDiff, diffToString, diffToHtml} from '../src/common/util/dubdiff'

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
    )).to.equal('This is a [-smlb sentnce -]{+simple sentence +}with no errors.')
  })

  it('plaintext diffs with word deletion', ()=>{  
    expect(diff(
      'Gonna delete a word.',
      'Gonna delete word.'
    )).to.equal('Gonna delete [-a -]word.')
  })

  it('plaintext diffs with word insertion', ()=>{  
    expect(diff(
      'Gonna delete word.',
      'Gonna delete a word.'
    )).to.equal('Gonna delete {+a +}word.')
  })

  it('reorganizes insertions after multiline deletions', ()=>{
    expect(diff(
`# Title
other`,
`# Subtitle`
    )).to.equal('# [-Title-]{+Subtitle+}\n[-other-]')
  })

  it('pulls prefixes out of ins or del blocks after newline',  () => {
    expect(diff(
      '# Title\n > hello',
      '# Title\n - goodbye'
    )).to.equal('# Title\n > [-hello-]\n - {+goodbye+}')
  })

  it('respects bold and italic boundaries',  () => {
    expect(diff(
      'This *word* **isn\'t** changed.',
      'This *other one* **is** changed.'
    )).to.equal('This *[-word-]{+other one+}* **[-isn\'t-]{+is+}** changed.')
  })
  it('respects link boundaries in link text',  () => {
    expect(diff(
      'This [link](https://somewhere.com) is the same.',
      'This [target](https://somewhere.com) changed.'
    )).to.equal('This [[-link-]{+target+}](https://somewhere.com) [-is the same-]{+changed+}.')
  })
  it('respects link boundaries in link target',  () => {
    expect(diff(
      'This [link](https://somewhere.com) is the same.',
      'This [link](https://somewhere.org) changed.'
    )).to.equal('This [link](https://somewhere.[-com-]{+org+}) [-is the same-]{+changed+}.')
  }) 
  it('deletes a title' , () => {
    expect(diff(
      'Hello\n# Title 1\n# Title 2',
      'Hello\n# Title 2'
    )).to.equal('Hello\n# Title [-1-]\n# [-Title -]2',)
  })
  it('deletes a more different title' , () => {
    expect(diff(
      'Hello\n# Filbert\n# Title 2',
      'Hello\n# Title 2'
    )).to.equal('Hello\n# [-Filbert-]\n# Title 2',)
  })
})

