import  {Route, IndexRout, Redirect } from 'react-router'
import React from 'react';

import Main from './components/Main'
import Compare from './components/Compare'

var routes = [
<Route path="/" component={Main}/>,
<Route path="/:compareId" component={Compare}/>

]

export default routes
