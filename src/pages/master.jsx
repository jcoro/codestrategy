import React from 'react'
import {Link} from 'react-router'

const Master = React.createClass({
  render: function() {

    return (<div>
      <header>
        <h1><Link to="/">CodeStrategy.org</Link></h1>
        <div>
          <Link to="/rules">Game Rules</Link>
        </div>
          <div>
              <Link to="/">Home</Link>
          </div>
      </header>

      <div id="mainContent">
        {this.props.children}
      </div>

      <footer>
          <div>An Educational Logic Game using Mastermind<sup>&reg;</sup></div>
          <div>Contact: <a href="mailto:john@coronite.net">john@coronite.net</a></div>
      </footer>
    </div>)
  }
})

export default Master
