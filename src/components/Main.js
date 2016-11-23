
import React from 'react'
import {connect} from 'react-redux'

import * as Actions from '../actions'
import * as Selectors from '../selectors'

const mapStateToProps = (state) => ({
  input: state.input, 
  safeInput: Selectors.safeInput(state),
})

  
const mapDispatchToProps = dispatch => ({
  onChangeOriginal: (text) => dispatch(Actions.updateOriginalInput(text)),
  onChangeFinal: (text) => dispatch(Actions.updateFinalInput(text))
})


class Main extends React.Component {
  
  constructor() {
    super()

  }

  render () { 
    return (
      <div class="container">
        <form class="row">
          <div class="col-md-2 col-sm-12 form-group">
            <div class="controls well col-lg-12">
              <a type="button" ng-click="compare()" class="btn btn-block btn-primary">compare</a>
            </div>
            <div class="controls well btn-group col-lg-12">
              <a ng-class="{&quot;active&quot;: isMarkdownFormat}" type="submit" ng-click="toggleMarkdownFormat()" class="btn btn-block btn-primary active">
                <span ng-class="{&quot;glyphicon-ok&quot;: isMarkdownFormat}" class="glyphicon glyphicon-ok"></span>
                &nbsp; As Markdown
              </a>
            </div>
          </div>
          <div class="col-lg-5 col-sm-12 form-group">
            <label for="docA">Original</label>
            <textarea id="docA" ng-model="docA" class="form-control"></textarea>
          </div>
          <div class="col-lg-5 col-sm-12 form-group">
            <label for="docB">Final</label>
            <textarea id="docB" ng-model="docB" class="form-control"></textarea>
          </div>
        </form>
      </div>
    )
  } 
}


function renderDate(props) {
  return <div>
    <DateInputForm/> 
    <div>
      <p><strong>Data for {props.formattedDate}</strong></p>
      <DateResultsSummary/>
      <DateResultsChart/>
    </div>
  </div>
}

function renderMonthly(props) {
  return <div>
      <p><strong>Yearly Data</strong></p>
      <MonthlyResultsSummary/>
      <MonthlyResultsChart/>
    </div>
}


export default connect(mapStateToProps, mapDispatchToProps)(Main)


/*
        {this.props.view == "RESULTS" ?
          (this.props.inputIsValid.valid ?
            <div>
              <p><strong>{this.props.formattedDate}</strong></p>
              <DateResultsSummary/>
              <DateResultsTable/>
            </div> : 
            <InvalidResults/>
          ): 
*/
