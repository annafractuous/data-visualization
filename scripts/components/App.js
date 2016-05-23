import React from 'react';
import autobind from 'autobind-decorator';

@autobind
class App extends React.Component {
  constructor() {
    super();
    this.state = {}
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
