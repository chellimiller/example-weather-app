export enum LocationType {
  // COORDINATES = 'COORDINATES',
  POSTAL_CODE = 'POSTAL_CODE',
  CITY_NAME = 'CITY_NAME',
}

type BaseLocation<T extends LocationType> = {
  type: T;
}

// export type Coordinates = BaseLocation<LocationType.COORDINATES> & {
//   latitude: number;
//   longitude: number;
// }

export type PostalCode = BaseLocation<LocationType.POSTAL_CODE> & {

  /** Postal codes in different countries may not just be numeric. */
  code: string;

  /** Defaults to `US`. */
  countryCode?: string;
}

export type CityName = BaseLocation<LocationType.CITY_NAME> & {

  /** Name of the city */
  city: string;

  /** State code. Only available in US locations. */
  stateCode?: string;

  /** Defaults to `US`. */
  countryCode?: string;
}

export type Location = PostalCode | CityName;