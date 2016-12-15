import React from 'react'
import {connect} from 'react-redux'
import {browserHistory} from 'react-router'

import {Button, Icon, Segment} from 'semantic-ui-react'

import * as Actions from '../actions'
import * as Selectors from '../selectors'

const mapStateToProps = (state) => ({
  format: state.format, 
  isMarkdownFormat: Selectors.isMarkdownFormat(state),
  saveStatus: state.saveStatus
})

  
const mapDispatchToProps = dispatch => ({
  onSetPlaintextFormat: (format) => dispatch(Actions.setPlaintextFormat()),
  onSetMarkdownFormat: (format) => dispatch(Actions.setMarkdownFormat()), 

  //returns an id for the record to be saved
  startSaveAsync: () => {
    return dispatch(Actions.save())
  }
})

class MainControls extends React.Component {

  onClickCompare() {
    //start saving the input to the server
    const id = this.props.startSaveAsync()

    //we can use the id created by the save method to build a path
    const comparePath = `/${id}`
    browserHistory.replace(comparePath)

    return false
  }

  onClickMarkdownFormat() {
    if (this.props.isMarkdownFormat)
      this.props.onSetPlaintextFormat()
    else
      this.props.onSetMarkdownFormat()
  }


  render() {
    return (
      <Segment.Group>
        <Segment >
          <Button fluid onClick={this.onClickCompare.bind(this)}>Compare</Button>
        </Segment>

        <Segment >
          <Button fluid active={this.props.isMarkdownFormat} type="submit" onClick={this.onClickMarkdownFormat.bind(this)}>
            {this.props.isMarkdownFormat ? <Icon name="checkmark"/> : <span/>}
            &nbsp;As Markdown
          </Button>
        </Segment>
      </Segment.Group>
    )
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(MainControls)

/*
<a type="button" onClick={this.onClickCompare.bind(this)} className="btn btn-block btn-primary">compare</a>*/