import { Request } from "express";
import fs from 'fs';
import path from 'path';

/**
 * Describes an asset requested by the client.
 */
export type Asset = {

  /** URL requested by the client. */
  url: string;

  /** File path that was read. */
  path: string;
} & ({

  /** Content to return to client. */
  content: string;

  /** Error thrown when attempting to access asset. */
  error: undefined;
} | {

  /** Content to return to client. */
  content: undefined;

  /** Error thrown when attempting to access asset. */
  error: NodeJS.ErrnoException;
});

export default function readAsset(url: string): Promise<Asset> {
  const assetPath = path.join(__dirname, url);

  return new Promise((resolve, reject) => {
    fs.readFile(assetPath, { encoding: 'utf-8' }, (error, content) => {
      if (error) {
        resolve({
          path: assetPath,
          url,
          content: undefined,
          error,
        });
        return;
      }

      resolve({
        path: assetPath,
        url,
        content,
        error: undefined,
      });
    })
  });
}
