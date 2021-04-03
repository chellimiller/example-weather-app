import { Action, Dispatch, Middleware } from 'redux';
import { requestCities, requestWeatherData } from '../api';
import { ResultStatus } from '../types';
import { AppAction, AppActionType, setLocationQuery, setSelectedCity, setWeatherResult } from './actions';
import { selectCity, selectLocationQueryResult, selectWeatherQueryResult } from './selectors';
import { AppState } from './types';

export const handleSetLocation: Middleware<{}, AppState, Dispatch<Action>> = (store) => (next) => (action: AppAction) => {
  if (action.type === AppActionType.SET_LOCATION) {
    const { query } = action;

    const locationResult = selectLocationQueryResult(store.getState(), query);

    if (!locationResult || locationResult.status === ResultStatus.ERROR || locationResult.status === ResultStatus.UNEXPECTED_ERROR) {
      requestCities(query).then((result) => next(setLocationQuery({ query, result })));
      store.dispatch(setLocationQuery({
        query, result: {
          status: ResultStatus.LOADING,
          message: 'Loading coordinates',
        }
      }))
    } else if (locationResult.status === ResultStatus.DATA_LOAD) {
      const cityId = Array.isArray(locationResult.data) ? locationResult.data[0] : locationResult.data;
      next(setSelectedCity(selectCity(store.getState(), cityId)));
    } else {
      store.dispatch(action);
    }
  }
}

export const handleRequestWeather: Middleware<{}, AppState, Dispatch<Action>> = (store) => (next) => (action: AppAction) => {
  if (action.type === AppActionType.SET_SELECTED_CITY || action.type === AppActionType.SET_LOCATION_QUERY_RESULT) {

    if (action.type === AppActionType.SET_LOCATION_QUERY_RESULT && (action.result.status !== ResultStatus.DATA_LOAD || Array.isArray(action.result.data))) {
      next(action);
      return;
    }

    console.log('yo');
    // @todo #6 Remove any cast
    const city = action.type === AppActionType.SET_SELECTED_CITY ? action.city : (action.result as any).data;

    const weatherResult = selectWeatherQueryResult(store.getState(), city);

    if (!weatherResult || weatherResult.status === ResultStatus.ERROR || weatherResult.status === ResultStatus.UNEXPECTED_ERROR) {
      const query = typeof city === 'string' ? selectCity(store.getState(), city) : city;
      requestWeatherData(query).then((result) => store.dispatch(setWeatherResult({ query, result })))

      store.dispatch(setLocationQuery({
        query, result: {
          status: ResultStatus.LOADING,
          message: 'Loading weather',
        }
      }))
    }

    next(action);
  }
}