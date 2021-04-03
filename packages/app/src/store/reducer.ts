import { ResultStatus } from '../types';
import { AppAction, AppActionType } from './actions';
import { AppState, CityId, LocationState } from './types';
import { createCityId, createLocationQueryId } from './util';

const INITIAL_STATE: AppState = {
  weather: {
    queries: {},
  },
  location: {
    cities: {},
    queries: {},
  }
};

export default function reducer(state: AppState = INITIAL_STATE, action: AppAction): AppState {
  if (action.type === AppActionType.SET_LOCATION_QUERY_RESULT) {
    const queryId = createLocationQueryId(action.query);

    if (action.result.status === ResultStatus.DATA_LOAD) {
      const cities: LocationState['cities'] = { ...state.location.cities };

      let data: CityId | CityId[];

      if (Array.isArray(action.result.data)) {
        const cityIds: CityId[] = [];
        action.result.data.forEach((city) => {
          const cityId: CityId = createCityId(city);
          cities[cityId] = city;
          cityIds.push(cityId);
        })
        data = cityIds;
      } else {
        const cityId: CityId = createCityId(action.result.data);
        cities[cityId] = action.result.data;
        data = cityId;
      }

      const result = { ...action.result, data };
      // @todo #6 We don't want to just set this unless there's only one in the city list
      const selectedCityId = Array.isArray(data) ? data[0] : data;

      return {
        ...state,
        location: {
          ...state.location,
          cities,
          selectedCityId,
          queries: {
            ...state.location.queries,
            [queryId]: result,
          },
          latestQuery: queryId,
        }
      }
    }

    return {
      ...state,
      location: {
        ...state.location,
        queries: {
          ...state.location.queries,
          [queryId]: action.result,
        },
        latestQuery: queryId,
      }
    }
  }

  if (action.type === AppActionType.SET_SELECTED_CITY) {
    const selectedCityId: CityId = createCityId(action.city);
    return {
      ...state,
      location: {
        ...state.location,
        selectedCityId,
      }
    }
  }

  if (action.type === AppActionType.SET_WEATHER_RESULT) {
    const cityId: CityId = createCityId(action.query);
    return {
      ...state,
      weather: {
        queries: {
          ...state.weather.queries,
          [cityId]: {
            ...action.result,
            updated: Date.now(),
          },
        },
      }
    }
  }

  // Other actions are handled in middleware.

  return state;
}