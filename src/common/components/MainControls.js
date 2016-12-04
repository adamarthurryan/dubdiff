import React from 'react'
import {connect} from 'react-redux'
import {Link} from 'react-router'

import {Button, Icon, Segment} from 'semantic-ui-react'

import * as Actions from '../actions'
import * as Selectors from '../selectors'

const mapStateToProps = (state) => ({
  format: state.format, 
  isMarkdownFormat: Selectors.isMarkdownFormat(state)
})

  
const mapDispatchToProps = dispatch => ({
  onSetPlaintextFormat: (format) => dispatch(Actions.setPlaintextFormat()),
  onSetMarkdownFormat: (format) => dispatch(Actions.setMarkdownFormat())
})

class MainControls extends React.Component {

  onClickCompare() {

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
          <Link to="compare"><Button fluid>Compare</Button></Link>
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