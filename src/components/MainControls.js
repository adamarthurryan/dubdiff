import React from 'react'
import {connect} from 'react-redux'
import {Link} from 'react-router'

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
      <div className="form-group">
        <div className="controls well col-lg-12">
        <Link to="compare" className="btn btn-block btn-primary">Compare</Link>
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

export default connect(mapStateToProps, mapDispatchToProps)(MainControls)

/*
<a type="button" onClick={this.onClickCompare.bind(this)} className="btn btn-block btn-primary">compare</a>*/