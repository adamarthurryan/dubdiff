import React from 'react'
import {connect} from 'react-redux'

import {Message, Icon, Button} from 'semantic-ui-react'

import * as Actions from '../actions'
import {Status, StatusError} from '../constants'

const mapStateToProps = (state) => ({
  status: state.status
})

const mapDispatchToProps = dispatch => ({
  onSave: () => dispatch(Actions.save()),
  onReset: () => dispatch(Actions.reset())
})

const SaveStatus = (props) => {
  if (props.status.type === Status.SAVING) {
    return (
      <Message size='tiny' floating compact icon>
        <Icon name='circle notched' loading />
        <Message.Content>
          <Message.Header>Saving diff</Message.Header>
        </Message.Content>
      </Message>
    )
  }
  if (props.status.type === Status.LOADING) {
    return (
      <Message size='tiny' floating compact icon>
        <Icon name='circle notched' loading />
        <Message.Content>
          <Message.Header>Loading diff</Message.Header>
        </Message.Content>
      </Message>
    )
  } else if (props.status.hasError && props.status.errorType === StatusError.SAVE_ERROR) {
    return (
      <Message size='tiny' floating compact icon>
        <Icon name='exclamation' />
        <Message.Content>
          <Message.Header>Error saving diff</Message.Header>
          {props.status.error.message}
          <br />
          <Button onClick={props.onSave}>Retry</Button>
        </Message.Content>
      </Message>
    )
  } else if (props.status.hasError && props.status.errorType === StatusError.LOAD_ERROR) {
    return (
      <Message size='tiny' floating compact icon>
        <Icon name='exclamation' />
        <Message.Content>
          <Message.Header>Error loading diff</Message.Header>
          {props.status.error.message}
          <br />
          <Button onClick={props.onReset}>New Diff</Button>
        </Message.Content>
      </Message>
    )
  } else return (<div />)
}

export default connect(mapStateToProps, mapDispatchToProps)(SaveStatus)
