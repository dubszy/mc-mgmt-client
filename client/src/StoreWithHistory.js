import { createStore, applyMiddleware } from 'redux'
import createHistory from 'history/createBrowserHistory'
import { routerMiddleware } from 'react-router-redux'

import { reducer } from './reducers/CombinedReducer'

const enhancer = () => {
  return applyMiddleware(
      routerMiddleware(history)
    );
}

export function buildStore(initialState = {}) {
  return createStore(reducer, initialState, enhancer());
}

export const history = createHistory();
export const store = buildStore();
