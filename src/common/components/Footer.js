import React from 'react'

import {Segment} from 'semantic-ui-react'

const Footer = (props) => (
  <Segment basic padded textAlign="center" as="footer">
    <p><a href="http://adamarthurryan.com">Adam Brown</a> | This website is <a href="https://github.com/adamarthurryan/dubdiff">open source</a>.</p>
  </Segment>
)

export default Footer