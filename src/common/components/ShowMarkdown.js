import React from 'react'


//use markdown-it to render markdown
//alternately use markdown to jsx

const ShowMarkdown = (props) => {
  return <div>
    <pre style={{whiteSpace:'pre-wrap'}}>
      {props.text ?
        props.text: 
        props.diff ?
          diffToPre(props.diff) :
          null
      }
    </pre>
  </div>
}

export default ShowMarkdown

function diffToPre(diff) {
  return diff.map(part => (
      part.added ? <span><ins>{part.value}</ins>{ifNotNewlineSpace(part.value)}</span> :
      part.removed ? <span><del>{part.value}</del>{ifNotNewlineSpace(part.value)}</span> :
      <span>{part.value}{ifNotNewlineSpace(part.value)}</span>
    ))
}



const ifNotNewlineSpace = str => {
  return !str.endsWith('\n') ? ' ' : ''
}