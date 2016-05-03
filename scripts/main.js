import React from 'react';
import ReactDOM from 'react-dom';
import { Router, Route } from 'react-router';
import { browserHistory } from 'react-router'

// Firebase
import Rebase from 're-base';
var base = Rebase.createClass('https://the-daily-catch.firebaseio.com/')

// Bind Scope
import autobind from 'autobind-decorator';

/*
  App
*/

@autobind
class App extends React.Component {
  render() {
    return (
      <h1>HOLA</h1>
    )
  }
}

var routes = (
  <Router history={browserHistory}>
    <Route path="/" component={App} />
  </Router>
)

ReactDOM.render(routes, document.querySelector('#main'));
