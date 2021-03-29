import { readFile } from 'fs';
import { join } from 'path';
import { ReadAssetErrorType } from '../types';
import readAsset from './readAsset';
import sendAsset from './sendAsset';

jest.mock('fs', () => ({
  __esModule: true,
  readFile: jest.fn(),
}));

jest.mock('path', () => ({
  __esModule: true,
  join: jest.fn(),
}));

describe('readAsset', () => {
  it(`resolves with data when read successfully`, async () => {
    // Arrange
    const data = 'Lorem ipsum';
    (readFile as unknown as jest.Mock).mockImplementationOnce((_path, _config, callback) => callback(null, data));
    const url = 'any';

    // Act
    const result = await readAsset(url);

    // Assert
    expect(result.data).toBe(data);
  });

  it(`resolves with error when asset cannot be read`, async () => {
    // Arrange
    const error = Symbol('Unique Error');
    const filePath = Symbol('File path');
    (readFile as unknown as jest.Mock).mockImplementationOnce((_path, _config, callback) => callback(error, undefined));
    (join as unknown as jest.Mock).mockImplementationOnce(() => filePath);
    const url = 'any';

    // Act
    const result = await readAsset(url);

    // Assert
    expect(result.error).toEqual({
      message: `Cannot access '${url}'`,
      type: ReadAssetErrorType.READ_FILE,
      details: error,
      filePath,
      url,
    });
  });

  it(`validates asset if provided validator`, async () => {
    // Arrange
    const data = Symbol('Unique data');
    (readFile as unknown as jest.Mock).mockImplementationOnce((_path, _config, callback) => callback(null, data));
    const url = 'any';
    const validate = jest.fn().mockImplementation((data) => ({ data }));

    // Act
    const result = await readAsset(url, validate);

    // Assert
    expect(validate.mock.calls[0][0]).toBe(data);
    expect(result.data).toBe(data);
  });

  it(`adds filePath and url when validator returns error result`, async () => {
    // Arrange
    const data = Symbol('Unique data');
    const filePath = Symbol('File path');
    (readFile as unknown as jest.Mock).mockImplementationOnce((_path, _config, callback) => callback(null, data));
    (join as unknown as jest.Mock).mockImplementationOnce(() => filePath);
    const url = 'any';
    const error = { type: ReadAssetErrorType.VALIDATION, message: 'Error' };
    const validate = jest.fn().mockImplementation(() => ({ error }));

    // Act
    const result = await readAsset(url, validate);

    // Assert
    expect(validate.mock.calls[0][0]).toBe(data);
    expect(result.error).toEqual({
      ...error,
      filePath,
      url,
    });
  });

  afterEach(() => jest.resetAllMocks());
});
