import { Request } from 'express';
import { ServerSettings } from '../types';
import isSameOrigin from './isSameOrigin';

/**
 * Create a basic object to use as the `Request` for the unit tests.
 *
 * @param headers Headers that are a part of the test `Request` object
 * @returns Object with `headers` that is casted to a `Request`.
 */
function createTestRequest(headers: Partial<Request['headers']> = {}): Request {
  return {
    headers: { ...headers },
  } as Request;
}

/**
 * Create default `ServerSettings` object to use for the unit tests.
 *
 * @returns `ServerSettings` to use for the unit tests.
 */
function createTestServerSettigs(): ServerSettings {
  return {
    port: 3000,
    hostname: 'test',
  };
}

describe('isSameOrigin', () => {
  it(`returns false when there is no referer`, () => {
    // Arrange
    const serverSettings = createTestServerSettigs();
    const request = createTestRequest({ referer: undefined });

    // Act
    const result = isSameOrigin(request, serverSettings);

    // Assert
    expect(result).toBe(false);
  });

  it(`returns false when referer is same host but different port`, () => {
    // Arrange
    const serverSettings = createTestServerSettigs();
    const request = createTestRequest({ referer: `http://${serverSettings.hostname}:${serverSettings.port + 1}/` });

    // Act
    const result = isSameOrigin(request, serverSettings);

    // Assert
    expect(result).toBe(false);
  });

  it(`returns false when referer is same port but different host`, () => {
    // Arrange
    const serverSettings = createTestServerSettigs();
    const request = createTestRequest({ referer: `http://${serverSettings.hostname + 'foo'}:${serverSettings.port}/` });

    // Act
    const result = isSameOrigin(request, serverSettings);

    // Assert
    expect(result).toBe(false);
  });

  it(`returns true when referer is same host and port`, () => {
    // Arrange
    const serverSettings = createTestServerSettigs();
    const request = createTestRequest({ referer: `http://${serverSettings.hostname}:${serverSettings.port}/` });

    // Act
    const result = isSameOrigin(request, serverSettings);

    // Assert
    expect(result).toBe(true);
  });
});
