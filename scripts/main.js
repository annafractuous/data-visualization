// React
import React from 'react';
import ReactDOM from 'react-dom';
import { Router, Route } from 'react-router';
import { browserHistory } from 'react-router';

// Firebase
import Rebase from 're-base';
import Firebase from 'firebase';

var base = Rebase.createClass('https://data-viz.firebaseio.com/');
const ref = new Firebase('https://data-viz.firebaseio.com/');

// Bind Scope
import autobind from 'autobind-decorator';

// Components
import App from './components/App';

/*
  Routes
*/
var routes = (
  <Router history={browserHistory}>
    <Route path="/" component={App} />
  </Router>
)

ReactDOM.render(routes, document.querySelector('#main'));
