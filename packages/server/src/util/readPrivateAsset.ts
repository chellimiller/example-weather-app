import path from 'path';
import readAsset, { AssetValidator, Asset } from './readAsset';

export default function readPrivateAsset<T>(asset: string, validateAsset: AssetValidator<T>): Promise<Asset<T>> {
  return readAsset(path.join('config', asset), validateAsset);
}
