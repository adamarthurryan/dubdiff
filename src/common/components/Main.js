
import React from 'react'
import {connect} from 'react-redux'

import {Segment, Grid, Form} from 'semantic-ui-react'

import * as Actions from '../actions'
import * as Selectors from '../selectors'

import Header from './Header'
import Footer from './Footer'
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

        <Segment basic padded>
          <Grid stackable columns={3}>
            <Grid.Column width="3">
              <MainControls/> 
            </Grid.Column>
            <Grid.Column width="6">
              <Form>
                <Form.Field>
                  <label>Original</label>
                  <textarea value={this.props.input.original} onChange={event => this.props.onChangeOriginal(event.target.value)}></textarea>
                </Form.Field>
              </Form>
            </Grid.Column>
            <Grid.Column width="6">
                <Form>
                <Form.Field>
                  <label>Final</label>
                  <textarea value={this.props.input.final} onChange={event => this.props.onChangeFinal(event.target.value)}></textarea>
                </Form.Field>
              </Form>
            </Grid.Column>
          </Grid>
        </Segment>


        <Footer/>
      </div>



    )
  } 
}

export default connect(mapStateToProps, mapDispatchToProps)(Main)

