import React from 'react'

import markdownCompiler  from 'markdown-to-jsx'

import {diffToString, diffToHtml} from '../util/dubdiff'

const ShowMarkdown = (props) => {
  if (props.diff)
    console.log(diffToString(props.diff))

  return <div>
      {
        props.text ?
          markdownCompiler(props.text) :
        props.diff ?
          markdownCompiler(diffToHtml(props.diff)) :
        null
      }
  </div>
}

export default ShowMarkdown

