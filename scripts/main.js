// React
import React from 'react';
import ReactDOM from 'react-dom';
import { Router, Route } from 'react-router';
import { browserHistory } from 'react-router';
// Firebase
import Rebase from 're-base';
var base = Rebase.createClass('https://data-viz.firebaseio.com/');
import Firebase from 'firebase';
const ref = new Firebase('https://data-viz.firebaseio.com/');
// Bind Scope
import autobind from 'autobind-decorator';

// Components
import App from './components/App';

// Parsing Data
import { datasets } from './datasets';
import { parseHsDemographicsData, parseHsOfferingsData, parseDistrictDemographicsData } from './data_parsers';

/*
  Save Data to Firebase
*/

for (var set in datasets) {
  var dataset = datasets[set];
  if (dataset.saved === false) {
    if (dataset.endpoint) {
      handleData(dataset.endpoint, dataset.firebaseRef, dataset.parsingFunction);
    }
    else if (dataset.data) {
      parsedData = dataset.parsingFunction(dataset.data);
      saveToFirebase(dataset.firebaseRef, parsedData);
    }
  }
}

var parsedData = {};
function handleData(endpoint, firebaseLocation, parsingFunction){
  fetch(endpoint)
    .then((response) => {
      return response.json();
    })
    .then((dataHash) => {
      parsedData = parsingFunction(dataHash);
      saveToFirebase(firebaseLocation, parsedData);
    })
    .catch((error) => {
      console.warn(error);
    });
}

function saveToFirebase(firebaseLocation, data) {
  var firebaseRef = ref.child(firebaseLocation);
  firebaseRef.set(data);
}

/*
  Routes
*/
var routes = (
  <Router history={browserHistory}>
    <Route path="/" component={App} />
  </Router>
)

ReactDOM.render(routes, document.querySelector('#main'));
