import React from 'react'

import {Segment, Header} from 'semantic-ui-react'

import {Link} from 'react-router'

const SiteHeader = (props) => (
  <Segment basic padded textAlign="center" as="header" id='masthead'>
    <Header><Link to="/">dubdiff</Link></Header>
  </Segment>
)

export default SiteHeader