import React from 'react'
import {connect} from 'react-redux'
import {Link} from 'react-router'

import {Button, Icon, Segment} from 'semantic-ui-react'

import * as Actions from '../actions'
import * as Selectors from '../selectors'

const mapStateToProps = (state) => ({
  isMarkdownFormat: Selectors.isMarkdownFormat(state),
  isShowOriginal: Selectors.isShowOriginal(state),
  isShowFinal: Selectors.isShowFinal(state),
  isShowDifference: Selectors.isShowDifference(state),
})

  
const mapDispatchToProps = dispatch => ({
  onSetPlaintextFormat: () => dispatch(Actions.setPlaintextFormat()),
  onSetMarkdownFormat: () => dispatch(Actions.setMarkdownFormat()), 
  onShowOriginal: () => dispatch(Actions.showOriginal()),
  onShowFinal: () => dispatch(Actions.showFinal()),
  onShowDifference: () => dispatch(Actions.showDifference()),

})

class CompareControls extends React.Component {

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
          <Button fluid onClick={this.props.onShowOriginal} active={this.props.isShowOriginal}>Original</Button>
          <Button fluid onClick={this.props.onShowFinal} active={this.props.isShowFinal}>Final</Button>
          <Button fluid onClick={this.props.onShowDifference} active={this.props.isShowDifference}>Difference</Button>
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

export default connect(mapStateToProps, mapDispatchToProps)(CompareControls)

