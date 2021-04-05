export type UsStateCode = string;

export type CountryCode = string;

export enum LocationQueryType {
  CITY = 'CITY',
  ZIP_CODE = 'ZIP_CODE',
}

export type CityLocationQuery = {
  type: LocationQueryType.CITY;
  city: string;
  state?: UsStateCode;
  country?: CountryCode;
}

export type ZipcodeLocationQuery = {
  type: LocationQueryType.ZIP_CODE;
  zipcode: string;
  country?: CountryCode;
}

export type LocationQuery = CityLocationQuery | ZipcodeLocationQuery;

export type City = {
  name: string;
  lat: number;
  lon: number;
  country: CountryCode;
  state?: UsStateCode;
}
