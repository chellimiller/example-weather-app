import { Request, Response } from 'express';
import { ServerSettings } from '../types';
import isSameOrigin from './isSameOrigin';
import sendAsset from './sendAsset';
import sendPrivateAsset from './sendPrivateAsset';

jest.mock('./isSameOrigin', () => ({
  __esModule: true,
  default: jest.fn(),
}));

jest.mock('./sendAsset', () => ({
  __esModule: true,
  default: jest.fn(),
}));

/**
 * Create a fake request for use in the `sendPrivateAsset` unit tests.
 *
 * @returns Casted `Request` object to use for testing
 */
function createTestRequest(): Request {
  return {} as any;
}

/**
 * Create a fake response for use in the `sendPrivateAsset` unit tests.
 *
 * @returns Casted `Response` object to use for testing
 */
function createTestResponse(): Response {
  const send = jest.fn();
  const status = jest.fn();

  const response = { send, status };

  send.mockImplementation(() => response);
  status.mockImplementation(() => response);

  return response as any;
}

/**
 * Create fake server settings for use in the `sendPrivateAsset` unit tests.
 *
 * @returns Casted `ServerSettings` object to use for testing
 */
function createTestServerSettings(): ServerSettings {
  return {} as any;
}

describe('sendPrivateAsset', () => {
  it(`responds with 403 when not same origin`, () => {
    // Arrange
    (isSameOrigin as jest.Mock).mockImplementationOnce(() => false);
    const url = 'not important here';
    const request = createTestRequest();
    const response = createTestResponse();
    const serverSettings = createTestServerSettings();

    // Act
    sendPrivateAsset(url, request, response, serverSettings);

    // Assert
    expect((response.status as jest.Mock).mock.calls[0][0]).toBe(403);
    expect((sendAsset as jest.Mock).mock.calls.length).toBe(0);
  });

  it(`calls sendAsset with modified URL when same origin`, () => {
    // Arrange
    (isSameOrigin as jest.Mock).mockImplementationOnce(() => true);
    const url = 'private-asset.file';
    const request = createTestRequest();
    const response = createTestResponse();
    const serverSettings = createTestServerSettings();

    // Act
    sendPrivateAsset(url, request, response, serverSettings);

    // Assert
    expect((sendAsset as jest.Mock).mock.calls[0][0]).toBe(`config\\${url}`);
    expect((sendAsset as jest.Mock).mock.calls[0][1]).toBe(response);
  });

  afterEach(() => jest.resetAllMocks());
});
