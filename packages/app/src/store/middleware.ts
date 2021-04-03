import { Action, Dispatch, Middleware } from 'redux';
import { requestCities, requestWeatherData } from '../api';
import { ResultStatus } from '../types';
import { AppAction, AppActionType, setLocationQuery, setSelectedCity, setWeatherResult } from './actions';
import { selectLocationQueryResult, selectWeatherQueryResult } from './selectors';
import { AppState } from './types';

export const handleRequests: Middleware<{}, AppState, Dispatch<Action>> = (store) => (next) => (action: AppAction) => {
  if (action.type === AppActionType.SET_LOCATION) {
    const { query } = action;

    const locationResult = selectLocationQueryResult(store.getState(), query);

    if (!locationResult || locationResult.status === ResultStatus.ERROR || locationResult.status === ResultStatus.UNEXPECTED_ERROR) {
      requestCities(query).then(
        (result) => {
          store.dispatch(setLocationQuery({ query, result }));

          if (result.status === ResultStatus.DATA_LOAD) {
            const city = Array.isArray(result.data) ? result.data[0] : result.data;

            const weatherResult = selectWeatherQueryResult(store.getState(), city);
            if (!weatherResult || weatherResult.status === ResultStatus.ERROR || weatherResult.status === ResultStatus.UNEXPECTED_ERROR) {
              requestWeatherData(city).then((result) => store.dispatch(setWeatherResult({ query: city, result })))
            }

            store.dispatch(setSelectedCity(city));
          }
        }
      );

      store.dispatch(setLocationQuery({
        query, result: {
          status: ResultStatus.LOADING,
          message: 'Loading coordinates',
        }
      }))
    }

    return;
  }

  next(action);
}
