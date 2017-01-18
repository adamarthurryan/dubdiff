import React from 'react'
import {connect} from 'react-redux'

import {Segment, Grid} from 'semantic-ui-react'

import * as Selectors from '../selectors'

import Header from './Header'
import Footer from './Footer'
import CompareControls from './CompareControls'

import ShowPlaintext from './ShowPlaintext'
import ShowMarkdown from './ShowMarkdown'

const mapStateToProps = (state) => ({
  isMarkdownFormat: Selectors.isMarkdownFormat(state),
  isShowOriginal: Selectors.isShowOriginal(state),
  isShowFinal: Selectors.isShowFinal(state),
  isShowDifference: Selectors.isShowDifference(state),
  safeInput: Selectors.safeInput(state),
  diff: Selectors.diff(state)
})

const mapDispatchToProps = dispatch => ({
  // loadIfNeeded: (id) => dispatch(Actions.loadIfNeeded())
})

class Compare extends React.Component {
  /*
  componentDidMount() {
    this.props.loadIfNeeded(this.props.routeParams.compareId)
  }
  */

  render () {
    return (
      <div>
        <Header />

        <Segment basic padded>
          <Grid stackable columns={2}>
            <Grid.Column width='3'>
              <CompareControls />
            </Grid.Column>
            <Grid.Column width='13'>
              <Segment>
                {
                  (!this.props.isMarkdownFormat && this.props.isShowDifference)
                    ? <ShowPlaintext diff={this.props.diff}>{this.props.diff}</ShowPlaintext>
                    : (this.props.isMarkdownFormat && this.props.isShowDifference)
                      ? <ShowMarkdown diff={this.props.diff}>{this.props.diff}</ShowMarkdown>
                      : (!this.props.isMarkdownFormat && !this.props.isShowDifference)
                        ? <ShowPlaintext
                          text={this.props.isShowOriginal ? this.props.safeInput.original : this.props.safeInput.final}
                          />
                        : (this.props.isMarkdownFormat && !this.props.isShowDifference)
                          ? <ShowMarkdown
                            text={this.props.isShowOriginal ? this.props.safeInput.original : this.props.safeInput.final}
                            />
                          : null
                }
              </Segment>
            </Grid.Column>
          </Grid>
        </Segment>

        <Footer />
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
