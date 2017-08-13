import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './components/App';
import registerServiceWorker from './registerServiceWorker';
import { createStore, applyMiddleware, compose } from 'redux';
import reducer from './reducers';
import { Provider } from 'react-redux';

const logger = store => next => action => {
    console.group(action.type)
    console.info('dispatching', action)

    let result = next(action)
    console.log('next state', store.getState())
    console.groupEnd(action.type)
    return result
}

const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose

// This creates our redux store and passes it the reducer function
// The second parameter is specifically so a third party extension for testing redux apps will work correctly
const store = createStore(
    reducer,
    composeEnhancers(
        applyMiddleware(logger)
    )
);

//	window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__()

ReactDOM.render(
    <Provider store={store}>
		<App/>
	</Provider>, document.getElementById('root'));
registerServiceWorker();