import React, { Component } from 'react';
import GitHubSearch from './screens/GitHubSearch';
import './assets/css/App.css';
import 'semantic-ui-css/semantic.min.css'

class App extends Component {
  render() {
    return (
      <div className="App">
       <GitHubSearch/>
      </div>
    );
  }
}

export default App;
