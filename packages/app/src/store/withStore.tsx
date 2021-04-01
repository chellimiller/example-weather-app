import React from 'react';
import { Provider } from 'react-redux';
import { combineReducers, createStore, Reducer } from 'redux';
import location from './location';
import { AppAction, AppState } from './types';
import weather from './weather';

const reducer: Reducer<AppState, AppAction> = combineReducers({ weather, location });
const store = createStore(reducer);

export default function withStore<P>(Component: React.FC<P>): React.FC<P> {
  return (props: P) => (
    <Provider store={store}>
      <Component {...props} />
    </Provider>
  );
}