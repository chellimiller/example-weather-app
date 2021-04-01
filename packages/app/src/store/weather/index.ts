import { WeatherState, AppAction } from '../types';

const INITIAL_STATE: WeatherState = {};

export default function reducer(state: WeatherState = INITIAL_STATE, action: AppAction): WeatherState {
  return state;
}