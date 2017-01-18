import {Route} from 'react-router'
import React from 'react'

import Main from './components/Main'
import Compare from './components/Compare'

var routes = [
  <Route key='root' path='/' component={Main} />,
  <Route key='compare' path='/:compareId' component={Compare} />

]

export default routes
