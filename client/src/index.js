import React from 'react';
import {render} from 'react-dom';
import {Provider} from 'react-redux';
import {BrowserRouter, Switch, Route} from 'react-router-dom';
import storeFactory from './store';
import {addError} from './store/actions';
import App from './components/App';
import './stylesheets/index.css';
import '../node_modules/semantic-ui-css/semantic.min.css';

const handleError = error => {
  store.dispatch(
    addError(error.message)
  );
};

const store = storeFactory();
window.React = React;
window.store = store;
window.addEventListener("error", handleError);

render(
  <Provider store={store}>
    <BrowserRouter>
      <div>
        <Switch>
          <Route exact path='/' component={App} />
        </Switch>
      </div>
    </BrowserRouter>
  </Provider>,
  document.getElementById('root')
);
