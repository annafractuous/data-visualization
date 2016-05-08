import React from 'react';
import ReactDOM from 'react-dom';
import { Router, Route } from 'react-router';
import { browserHistory } from 'react-router';

// Firebase
import Rebase from 're-base';
var base = Rebase.createClass('https://data-viz.firebaseio.com/')
import Firebase from 'firebase';
const ref = new Firebase('https://data-viz.firebaseio.com/');

// Bind Scope
import autobind from 'autobind-decorator';


/*
  Fetch Data
*/

var datasets = {
  nycHighSchoolData: {
    endpoint: 'https://data.cityofnewyork.us/resource/4isn-xf7m.json',
    firebaseRef: 'hsdata'
  },
  schoolDistrictDemographics: {
    endpoint: 'https://data.cityofnewyork.us/resource/sh8v-yxdi.json',
    firebaseRef: 'districtdemographics'
  },
  schoolDistrictBoundaries: {
    endpoint: '../resources/school_districts.geojson',
    firebaseRef: 'districtboundaries'
  }
}


var parsed_data = {};
function handleData(endpoint, firebaseLocation, parsingFunction){
  fetch(endpoint)
    .then((response) => {
      return response.json();
    })
    .then((data_hash) => {
      parsed_data = parsingFunction(data_hash);
      var firebaseRef = ref.child(firebaseLocation);
      firebaseRef.set(parsed_data);
    })
    .catch((error) => {
      console.warn(error);
    });
}

// example google geodata API call:
// https://maps.googleapis.com/maps/api/geocode/json?address=1600+Amphitheatre+Parkway,+Mountain+View,+CA&key=AIzaSyC9xs915YosLLNqH2_q7fyNNJ6hgQ2GHsI

/*
  NYC High School Data
*/

var scrubSportsData = function(array){
  return array.filter(Boolean).join(", ").split(/,\s|;\s/);
}

function parseHighSchoolData(data_hash) {
  var nycHighSchoolData = {};
  data_hash.forEach(function(school){
    var name = school.school_name.replace(/\.|\/|#/g, "");
    var address = [school.primary_address_line_1, school.city, school.state_code, school.zip].join(", ");
    var grade_span = school.grade_span_min + "-" + school.grade_span_max;
    var ap_classes = school.advancedplacement_courses ? school.advancedplacement_courses.split(/,\s|;\s/) : "None listed";
    var ap_class_count = ap_classes.constructor === Array ? ap_classes.length : 0;
    var extracurriculars = school.extracurricular_activities ? school.extracurricular_activities.split(/,\s|;\s/) : "None listed";
    var sports = scrubSportsData([school.school_sports, school.psal_sports_boys, school.psal_sports_girls, school.psal_sports_coed]);

    nycHighSchoolData[name] = {
      address: address,
      grade_span: grade_span,
      ap_classes: ap_classes,
      ap_class_count: ap_class_count,
      extracurriculars: extracurriculars,
      sports: sports
    }
  })
  return nycHighSchoolData;
}

// handleData(datasets.nycHighSchoolData.endpoint, datasets.nycHighSchoolData.firebaseRef, parseHighSchoolData);

/*
  School Demographics Data
*/

// var parseDistrictDemographicsData = function(data_hash) {
//   var schoolDistrictDemographics = {};
//   data_hash.forEach(function(district){
//     var district = district.jurisdiction_name.split(" ")[1].replace(/^0/, "");  // "CSD 01 Manhattan" => "1"
//     var public_assistance = district.percent_receives_public_assistance.toString() * 100;
//     var hispanic = district.percent_hispanic_latino.toString() * 100;
//     var black = district.percent_black_non_hispanic.toString() * 100;
//     var white = district.percent_white_non_hispanic.toString() * 100;
//     var us_citizen = district.percent_us_citizen.toString() * 100;
//
//     schoolDistrictDemographics[district] = {
//       us_citizen: us_citizen,
//       white: white,
//       black: black,
//       hispanic: hispanic,
//       public_assistance: public_assistance
//     }
//   })
//   return schoolDistrictDemographics;
// }
//
// handleData(datasets.schoolDistrictDemographics.endpoint, datasets.schoolDistrictDemographics.firebaseRef, parseDistrictDemographicsData);

/*
  App
*/

@autobind
class App extends React.Component {
  constructor() {
    super();
    this.state = {
      hs_data: {}
    }
  }

  renderData(key) {
  }

  render() {
    return (
      <div>
        <h1>HOLA</h1>
      </div>
    )
  }
}

var routes = (
  <Router history={browserHistory}>
    <Route path="/" component={App} />
  </Router>
)

ReactDOM.render(routes, document.querySelector('#main'));
