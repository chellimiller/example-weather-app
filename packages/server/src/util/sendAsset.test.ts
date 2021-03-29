import { Response } from 'express';
import { Asset, ReadAssetErrorType } from '../types';
import readAsset from './readAsset';
import sendAsset from './sendAsset';

jest.mock('./readAsset', () => ({
  __esModule: true,
  default: jest.fn(),
}));

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

describe('sendAsset', () => {
  it(`sends asset when read successfully`, async () => {
    // Arrange
    const data = 'Hello World';
    (readAsset as jest.Mock).mockImplementationOnce(() => Promise.resolve({ data }));
    const url = 'any';
    const response = createTestResponse();

    // Act
    await sendAsset(url, response);

    // Assert
    expect((response.send as jest.Mock).mock.calls[0][0]).toBe(data);
  });

  it(`responds with 404 when asset does not exist`, async () => {
    // Arrange
    const error = {
      type: ReadAssetErrorType.READ_FILE,
      details: {
        code: 'ENOENT',
      },
    };
    (readAsset as jest.Mock).mockImplementationOnce(() => Promise.resolve({ error }));
    const url = 'private-asset.file';
    const response = createTestResponse();

    // Act
    await sendAsset(url, response);

    // Assert
    expect((response.send as jest.Mock).mock.calls[0][0]).toBe(`Cannot find resource '${url}'`);
    expect((response.status as jest.Mock).mock.calls[0][0]).toBe(404);
  });

  it(`responds with 500 when error occurs that is not 'ENOENT'`, async () => {
    // Arrange
    const error = {
      type: ReadAssetErrorType.READ_FILE,
      message: 'Foo',
      details: {
        code: 'asdf',
      },
    };
    (readAsset as jest.Mock).mockImplementationOnce(() => Promise.resolve({ error }));
    const url = 'private-asset.file';
    const response = createTestResponse();

    // Act
    await sendAsset(url, response);

    // Assert
    expect((response.status as jest.Mock).mock.calls[0][0]).toBe(500);
    expect((response.send as jest.Mock).mock.calls[0][0]).toBe(`Cannot access resource '${url}'\nError Message: '${error.message}'`);
  });

  it(`responds with 500 when error occurs that is not a ReadAssetErrorType.READ_FILE type`, async () => {
    // Arrange
    const error = {
      type: ReadAssetErrorType.VALIDATION,
      message: 'Some message',
    };
    (readAsset as jest.Mock).mockImplementationOnce(() => Promise.resolve({ error }));
    const url = 'private-asset.file';
    const response = createTestResponse();

    // Act
    await sendAsset(url, response);

    // Assert
    expect((response.status as jest.Mock).mock.calls[0][0]).toBe(500);
    expect((response.send as jest.Mock).mock.calls[0][0]).toBe(`Cannot access resource '${url}'\nError Message: '${error.message}'`);
  });

  it(`responds with 500 when readAsset rejects the promise`, async () => {
    // Arrange
    (readAsset as jest.Mock).mockImplementationOnce(() => Promise.reject());
    const url = 'private-asset.file';
    const response = createTestResponse();

    // Act
    await sendAsset(url, response);

    // Assert
    expect((response.status as jest.Mock).mock.calls[0][0]).toBe(500);
    expect((response.send as jest.Mock).mock.calls[0][0]).toBe('Unknown internal server error');
  });

  afterEach(() => jest.resetAllMocks());
});
