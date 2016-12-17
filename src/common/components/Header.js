import React from 'react'
import {connect} from 'react-redux'

import {Segment, Header, Rail, Container} from 'semantic-ui-react'
import {Link} from 'react-router'

import * as Actions from '../actions'
import SaveStatus from './SaveStatus'

const mapStateToProps = (state) => ({
})

  
const mapDispatchToProps = dispatch => ({
  onReset: () => { console.log(Actions.reset()); dispatch(Actions.reset())},
})

const SiteHeader = (props) => (

  
    <Segment basic >

      <Segment basic padded textAlign="center" as="header" id='masthead'>
        <Header><Link onClick={props.onReset}>dubdiff</Link></Header>
      </Segment>

      <Rail internal position="right">
        <Segment basic padded>
          <SaveStatus/>
        </Segment>
      </Rail>

    </Segment>
)

export default connect(mapStateToProps, mapDispatchToProps)(SiteHeader)
