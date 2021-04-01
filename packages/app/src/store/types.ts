import { Action } from "redux";
import { Coordinates, Weather, Location } from "../types";

export type LocationState = {
  coordinates?: Coordinates;
  userProvided: Location;
}

export type WeatherState = {
  current?: Weather;
}

export type AppState = {
  location: LocationState;
  weather: WeatherState;
}

export type AppAction = Action;