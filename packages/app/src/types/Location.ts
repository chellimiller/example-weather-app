export type UsStateCode = string;

export type CountryCode = string;

export type CityLocationQuery = {
  zipcode?: undefined;
  city: string;
  state?: UsStateCode;
  country?: CountryCode;
}

export type ZipcodeLocationQuery = {
  zipcode: string;
  city?: undefined;
  state?: undefined;
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
