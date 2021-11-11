/* eslint-disable no-underscore-dangle */
import createSagaMiddleware from 'redux-saga';
import { applyMiddleware, compose, createStore } from 'redux';
import rootReducer from './reducers';
import rootSaga from '../sagas';

const sagaMiddleware = createSagaMiddleware();

const enhancers = compose(
  applyMiddleware(sagaMiddleware),
  process.env.NODE_ENV === 'development' && window.__REDUX_DEVTOOLS_EXTENSION__
    ? window.__REDUX_DEVTOOLS_EXTENSION__()
    : (f) => f,
);

const store = createStore(rootReducer, enhancers);

sagaMiddleware.run(rootSaga);

export default store;
