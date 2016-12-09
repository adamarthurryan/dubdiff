import React from 'react'
import {connect} from 'react-redux'

import {Segment, Grid, Form} from 'semantic-ui-react'

import * as Actions from '../actions'
import * as Selectors from '../selectors'

import Header from './Header'
import Footer from './Footer'
import CompareControls from './CompareControls'

import ShowPlaintext from './ShowPlaintext'

const mapStateToProps = (state) => ({
  isMarkdownFormat: Selectors.isMarkdownFormat(state),
  isShowOriginal: Selectors.isShowOriginal(state),
  isShowFinal: Selectors.isShowFinal(state),
  isShowDifference: Selectors.isShowDifference(state),
  compare: state.compare,
  diff: Selectors.diff(state)
})

const mapDispatchToProps = dispatch => ({
})



class Compare extends React.Component {

  render() {
    return (
      <div>
        <Header/>
    
        <Segment basic padded>
          <Grid stackable columns={2}>
            <Grid.Column width="3">
              <CompareControls/>
            </Grid.Column>
            <Grid.Column width="13">
              <Segment>
                { this.props.isShowDifference ?

                    <ShowPlaintext diff={this.props.diff} isMarkdownFormat={this.props.isMarkdownFormat}>{this.props.diff}</ShowPlaintext>: 

                    <ShowPlaintext 
                      text={this.props.isShowOriginal? this.props.compare.original: this.props.compare.final} 
                      isMarkdownFormat={this.props.isMarkdownFormat}
                    />
                }
              </Segment>
            </Grid.Column>
          </Grid>
        </Segment>

        <Footer/>
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