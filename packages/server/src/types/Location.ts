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

export type ZipCodeLocationQuery = {
  type: LocationQueryType.ZIP_CODE;
  zipCode: string;
  country?: CountryCode;
}

export type LocationQuery = CityLocationQuery | ZipCodeLocationQuery;

export type City = {
  name: string;
  lat: number;
  lon: number;
  country: CountryCode;
}
