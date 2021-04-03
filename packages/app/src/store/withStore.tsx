import React from 'react';
import { Provider } from 'react-redux';
import { applyMiddleware, createStore } from 'redux';
import { handleRequestWeather, handleSetLocation } from './middleware';
import reducer from './reducer';

const store = createStore(
  reducer,
  applyMiddleware(handleSetLocation, handleRequestWeather),
);

export default function withStore<P>(Component: React.FC<P>): React.FC<P> {
  return (props: P) => (
    <Provider store={store}>
      <Component {...props} />
    </Provider>
  );
}