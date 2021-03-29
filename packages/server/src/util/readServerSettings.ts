import { Asset } from './readAsset';
import readPrivateAsset from './readPrivateAsset';
import validateServerSettings, { ServerSettings } from './validateServerSettings';

export default function readServerSettings(): Promise<Asset<ServerSettings>> {
  return readPrivateAsset('settings.json', validateServerSettings);
}