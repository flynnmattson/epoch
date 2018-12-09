import reducer from './reducers';
import thunk from 'redux-thunk';
import { createStore, applyMiddleware } from 'redux';

const consoleMessages = store => next => action => {
	let result;
  if(!action) action = {};
  action.type = action.type || "ANONYMOUS OR CHAIN_CALL";
	console.groupCollapsed(`dispatching action => ${action.type}`);
	result = next(action);
	console.log(JSON.stringify(store.getState()));
	console.groupEnd();
	return result;
};

export default (initialState={}) => {
	return applyMiddleware(consoleMessages, thunk)(createStore)(reducer, initialState);
}
