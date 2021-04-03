import { readFile } from 'fs';
import { join } from 'path';
import { Asset, AssetValidator, ServerErrorCode } from '../types';

/**
 * Reads an asset's contents and validates the asset type structure if `validateAsset` is provided.
 *
 * @param url Asset URL requested. This is joined with `__dirname`.
 * @param validateAsset Function to validate the asset type.
 * @returns Promise with the result from reading the asset.
 */
export default function readAsset<T = string>(
  url: string,
  validateAsset: AssetValidator<T> = data => ({ data }),
): Promise<Asset<T>> {
  const filePath = join(__dirname, url);

  return new Promise((resolve) => {
    readFile(filePath, { encoding: 'utf-8' }, (error, data) => {
      if (error) {
        const code = error.code === 'ENOENT' ? ServerErrorCode.READ_FILE_001 : ServerErrorCode.READ_FILE_000;

        resolve({
          error: {
            code,
            data: {
              message: `Cannot access '${url}'`,
              details: error,
              filePath,
              url,
            },
          },
        });
        return;
      }

      resolve(validateAsset(data));
    })
  });
}
