import { readFile } from 'fs';
import { join } from 'path';
import { Asset, AssetValidator, ReadAssetErrorType } from '../types';

/**
 * Reads an asset's contents and validates the asset type structure if `validateAsset` is provided.
 *
 * @param url Asset URL requested. This is joined with `__dirname`.
 * @param validateAsset Function to validate the asset type.
 * @returns Promise with the result from reading the asset.
 */
export default function readAsset<T = string>(
  url: string,
  validateAsset: AssetValidator<T> = data => ({ data, error: undefined }),
): Promise<Asset<T>> {
  const filePath = join(__dirname, url);

  return new Promise((resolve) => {
    readFile(filePath, { encoding: 'utf-8' }, (error, data) => {
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
          type: ReadAssetErrorType.VALIDATION,
          filePath,
          url,
        },
      });
    })
  });
}
