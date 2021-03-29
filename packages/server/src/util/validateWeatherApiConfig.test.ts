import { WeatherApiConfigType } from '../types';
import validateWeatherApiConfig from './validateWeatherApiConfig';

describe('validateWeatherApiConfig', () => {
  it(`returns error result when config is not an object`, () => {
    // Arrange
    const config = 'not an object';

    // Act
    const result = validateWeatherApiConfig(config);

    // Assert
    expect(result.data).toBeFalsy();
    expect(result.error).toBeTruthy();
  });

  it(`returns error result when config.type is not a string`, () => {
    // Arrange
    const config = {
      type: false,
      key: 'some key',
    };

    // Act
    const result = validateWeatherApiConfig(config);

    // Assert
    expect(result.data).toBeFalsy();
    expect(result.error).toBeTruthy();
  });

  it(`returns error result when config.key is not a string`, () => {
    // Arrange
    const config = {
      type: WeatherApiConfigType.OPEN_WEATHER_MAP,
      key: 12345,
    };

    // Act
    const result = validateWeatherApiConfig(config);

    // Assert
    expect(result.data).toBeFalsy();
    expect(result.error).toBeTruthy();
  });

  it(`returns error result when config.type is not a valid type`, () => {
    // Arrange
    const config = {
      type: 'some invalid type',
      key: 'some key',
    };

    // Act
    const result = validateWeatherApiConfig(config);

    // Assert
    expect(result.data).toBeFalsy();
    expect(result.error).toBeTruthy();
  });

  it(`returns data result when config is valid`, () => {
    // Arrange
    const config = {
      type: WeatherApiConfigType.OPEN_WEATHER_MAP,
      key: 'some key',
    };

    // Act
    const result = validateWeatherApiConfig(config);

    // Assert
    expect(result.data).toBe(config);
    expect(result.error).toBeFalsy();
  });
});
