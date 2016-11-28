
import React from 'react'
import {connect} from 'react-redux'

import * as Actions from '../actions'
import * as Selectors from '../selectors'

import Header from './Header'
import MainControls from './MainControls'

const mapStateToProps = (state) => ({
  input: state.input,
  safeInput: Selectors.safeInput(state),
})

  
const mapDispatchToProps = dispatch => ({
  onChangeOriginal: (text) => dispatch(Actions.updateOriginalInput(text)),
  onChangeFinal: (text) => dispatch(Actions.updateFinalInput(text)),
})


class Main extends React.Component {
  
  constructor() {
    super()
  }

  render () { 
    return (
      <div>
        <Header/>
        <div className="container">
          <form className="row">
            <div className="col-md-2 col-sm-12">
              <MainControls/>
            </div>
            <div className="col-lg-5 col-sm-12 form-group">
              <label htmlFor="docA">Original</label>
              <textarea id="docA" value={this.props.input.original} onChange={event => this.props.onChangeOriginal(event.target.value)} className="form-control"></textarea>
            </div>
            <div className="col-lg-5 col-sm-12 form-group">
              <label htmlFor="docB">Final</label>
              <textarea id="docB" value={this.props.input.final} onChange={event => this.props.onChangeFinal(event.target.value)} className="form-control"></textarea>
            </div>
          </form>
        </div>
      </div>
    )
  } 
}

export default connect(mapStateToProps, mapDispatchToProps)(Main)

