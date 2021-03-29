import fs from 'fs';
import path from 'path';
import { Result } from '../types';

export enum ReadAssetErrorType {
  READ_FILE = 'READ_FILE',
  VALIDATION = 'VALIDATION',
}

type BaseReadAssetError = {
  filePath: string;
  url: string;
  message: string;
}

type ReadFileError = {
  type: ReadAssetErrorType.READ_FILE;
  details: NodeJS.ErrnoException;
};

type ValidateAssetError = {
  type: ReadAssetErrorType.VALIDATION;
  details: string;
  message: string;
}

export type ReadAssetError = BaseReadAssetError & (ReadFileError | ValidateAssetError);

export type AssetValidator<T = string> = (data: any) => Result<T, ValidateAssetError>;

export type Asset<T = string> = Result<T, ReadAssetError>;

export default function readAsset<T = string>(
  url: string,
  validateAsset: AssetValidator<T> = data => ({ data, error: undefined }),
): Promise<Asset<T>> {
  const filePath = path.join(__dirname, url);

  return new Promise((resolve) => {
    fs.readFile(filePath, { encoding: 'utf-8' }, (error, data) => {
      if (error) {
        resolve({
          data: undefined,
          error: {
            message: `Cannot access '${url}'`,
            type: ReadAssetErrorType.READ_FILE,
            details: error,
            filePath,
            url,
          },
        });
        return;
      }

      const validated = validateAsset(data);

      if (!validated.error) {
        resolve(validated);
        return;
      }

      resolve({
        data: undefined,
        error: {
          ...validated.error,
          filePath,
          url,
        },
      });
    })
  });
}
