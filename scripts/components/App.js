import React from 'react';
import autobind from 'autobind-decorator';
import Rebase from 're-base';
var base = Rebase.createClass('https://data-viz.firebaseio.com/');

@autobind
class App extends React.Component {
  constructor() {
    super();
    this.state = {
      hsOfferings: {},
      hsDemographics: {}
    }
  }

  componentWillMount() {
    base.bindToState('hsOfferings', {
      context: this,
      state: 'hsOfferings',
      asArray: true
    });
    base.bindToState('hsDemographics201516', {
      context: this,
      state: 'hsDemographics',
      asArray: true
    });
  }

  render() {
    return (
      <div>
        <h1>HOLA</h1>
      </div>
    )
  }
}

export default App;
