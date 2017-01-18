import React from 'react'

const ShowPlaintext = (props) => {
  return <div>
    <pre style={{whiteSpace: 'pre-wrap'}}>
      {props.text
        ? props.text
        : props.diff
          ? diffToPre(props.diff)
          : null
      }
    </pre>
  </div>
}

export default ShowPlaintext

function diffToPre (diff) {
  return diff.map((part, index) => (
      part.added
        ? <ins key={index}>{part.value}</ins>
        : part.removed
          ? <del key={index}>{part.value}</del>
          : <span key={index}>{part.value}</span>
    ))
}
