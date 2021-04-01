import { LocationType } from '../../types';
import { LocationState, AppAction } from '../types';

const INITIAL_STATE: LocationState = {
  userProvided: {
    type: LocationType.CITY_NAME,
    city: 'New York',
    stateCode: 'NY',
    countryCode: 'US',
  }
};

export default function reducer(state: LocationState = INITIAL_STATE, action: AppAction): LocationState {
  return state;
}