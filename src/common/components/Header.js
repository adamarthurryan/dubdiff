import React from 'react'
import {connect} from 'react-redux'

import {Segment, Header} from 'semantic-ui-react'
import {Link} from 'react-router'

import * as Actions from '../actions'

const mapStateToProps = (state) => ({
})

  
const mapDispatchToProps = dispatch => ({
  onClear: () => {
    dispatch(Actions.clearInput())
    dispatch(Actions.clearCompare())
  },
})

const SiteHeader = (props) => (
  <Segment basic padded textAlign="center" as="header" id='masthead'>
    <Link to="/"><Header onClick={props.onClear}>dubdiff</Header></Link>
  </Segment>
)

export default connect(mapStateToProps, mapDispatchToProps)(SiteHeader)
