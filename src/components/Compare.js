import React from 'react'
import {connect} from 'react-redux'

import * as Actions from '../actions'
import * as Selectors from '../selectors'

import Header from './Header'
import CompareControls from './CompareControls'

import Show from './Show'

const mapStateToProps = (state) => ({
  isMarkdownFormat: Selectors.isMarkdownFormat(state),
  isShowOriginal: Selectors.isShowOriginal(state),
  isShowFinal: Selectors.isShowFinal(state),
  isShowDifference: Selectors.isShowDifference(state),
  safeInput: Selectors.safeInput(state),
  diff: Selectors.diff(state)
})

const mapDispatchToProps = dispatch => ({
})



class Compare extends React.Component {

  render() {
    console.log(this.props.safeInput)
    return (
      <div>
        <Header/>
        <div className="container">
          <form className="row">
            <div className="col-md-2 col-sm-12">
              <CompareControls/>
            </div>
              <div className="col-md-10 col-sm-12 content-well">
                  { this.props.isShowDifference ?

                    <div>{this.props.diff}</div>: 

                    <Show 
                      text={this.props.isShowOriginal? this.props.safeInput.original: this.props.safeInput.final} 
                      isMarkdownFormat={this.props.isMarkdownFormat}
                    />
                  }
                   
              </div>
           </form>
        </div>
      </div>
    )
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Compare)


/*    <div ng-if="isMarkdownFormat">
      <div ng-show="isShowBefore" class="col-md-10 col-sm-12 content-well">
        <div btf-markdown="before" class="before"> 
        </div>
      </div>
      <div ng-show="isShowWdiff" class="col-md-10 col-sm-12 content-well">
        <div btf-markdown="wdiff" class="wdiff">
        </div>
      </div>
      <div ng-show="isShowAfter" class="col-md-10 col-sm-12 content-well">
        <div btf-markdown="after" class="after">
        </div>
      </div>
    </div>
    <div ng-if="!isMarkdownFormat">
      <div ng-show="isShowBefore" class="col-md-10 col-sm-12 content-well">
        <div ng-bind-html="before" class="content-pre before"></div>
      </div>
      <div ng-show="isShowWdiff" class="col-md-10 col-sm-12 content-well">
        <div ng-bind-html="wdiff" class="content-pre wdiff"></div>
      </div>
      <div ng-show="isShowAfter" class="col-md-10 col-sm-12 content-well">
        <div ng-bind-html="after" class="content-pre after"></div>
      </div>
    </div>
*/