import React from 'react'
import {connect} from 'react-redux'

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
  onCompare: () => dispatch(Actions.compare()) 
})

class MainControls extends React.Component {

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
          <Button fluid onClick={this.props.onCompare}>Compare</Button>
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