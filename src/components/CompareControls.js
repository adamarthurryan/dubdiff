import React from 'react'
import {connect} from 'react-redux'
import {Link} from 'react-router'

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
      <div className="form-group">
         <div className="controls well btn-group col-lg-12">
          <a type="submit" onClick={this.props.onShowOriginal} className={(this.props.isShowOriginal?'active ':'')+'btn btn-block btn-primary'}>Original</a>
          <a type="submit" onClick={this.props.onShowFinal} className={(this.props.isShowFinal?'active ':'')+'btn btn-block btn-primary'}>Final</a>
          <a type="submit" onClick={this.props.onShowDifference} className={(this.props.isShowDifference?'active ':'')+'btn btn-block btn-primary'}>Difference</a>
        </div>
        <div className="controls well btn-group col-lg-12">
          <a className={(this.props.isMarkdownFormat ? "active " : "")+"btn btn-block btn-primary"} type="submit" onClick={this.onClickMarkdownFormat.bind(this)}>
            <span className={(this.props.isMarkdownFormat ? "glyphicon-ok " : "") + "glyphicon"}></span>
            &nbsp; As Markdown
          </a>
        </div>
      </div>
    )
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(CompareControls)

