import React,{ Component } from 'react';
import '../stylesheets/App.css';
import ShowError from '../containers/ShowError';
import Message from '../containers/Message';
import GameArea from '../containers/GameArea';

class App extends Component {
  render() {
    return (
      <div className="App">
        <ShowError />
        <header className="App-header">
          <h1 className="App-title">Welcome to Epoch!</h1>
        </header>
        <Message />
        <GameArea />
      </div>
    );
  }
}

export default App;
