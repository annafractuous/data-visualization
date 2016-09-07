// Data
import { datasets } from './data/datasets';

var parsedData = {};

function saveToFirebase(firebaseLocation, data) {
  var firebaseRef = ref.child(firebaseLocation);
  firebaseRef.set(data);
}

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

for (var set in datasets) {
  var dataset = datasets[set];
  if (dataset.saved === false) {
    // some data is fetched from an endpoint, while others datasets were only available via download
    // check the source of each dataset, and handle it accordingly
    if (dataset.endpoint) {
      handleData(dataset.endpoint, dataset.firebaseRef, dataset.parsingFunction);
    }
    else if (dataset.data) {
      parsedData = dataset.parsingFunction(dataset.data);
      saveToFirebase(dataset.firebaseRef, parsedData);
    }
  }
}
