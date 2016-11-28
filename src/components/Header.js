import React from 'react'

import {Link} from 'react-router'

const Header = (props) => (
  <nav>
    <header id="banner" className="hero-unit">
      <div className="container">
        <h1><Link to="/">dubdiff</Link></h1>
        <h3></h3>
      </div>
    </header>
  </nav>
)

export default Header