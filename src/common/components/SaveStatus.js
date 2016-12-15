import React from 'react'
import {connect} from 'react-redux'

import { Message, Icon, Button} from 'semantic-ui-react'
import { browserHistory} from 'react-router'

import * as Actions from '../actions'

const mapStateToProps = (state) => ({
  saveStatus: state.saveStatus
})

  
const mapDispatchToProps = dispatch => ({
  retrySave: () => dispatch(Actions.save())
})

const onRetrySaveClick = (props) => {
      //we can use the id created by the save method to build a path
    const id = props.retrySave()
    const comparePath = `/${id}`
    browserHistory.replace(comparePath)
    return false
}


const SaveStatus = (props) => {
  if (props.saveStatus.waiting) return (
    <Message size='tiny' floating compact icon>
      <Icon name='circle notched' loading />
      <Message.Content>
        <Message.Header>Saving diff</Message.Header>
      </Message.Content>
    </Message>
  )
  else if (props.saveStatus.failed) return (
    <Message size='tiny' floating compact icon>
      <Icon name='exclamation' />
      <Message.Content>
        <Message.Header>Error saving diff</Message.Header>
        The server returned {props.saveStatus.error.message}. 
        <Button onClick={()=>onRetrySaveClick(props)}>Retry</Button>
      </Message.Content>
    </Message>
  
  )

  else return ( <div></div> )
}


export default connect(mapStateToProps, mapDispatchToProps)(SaveStatus)
