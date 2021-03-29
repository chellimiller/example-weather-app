import { Asset } from './readAsset';
import readPrivateAsset from './readPrivateAsset';
import validateWeatherApiConfig, { WeatherApiConfig } from './validateWeatherApiConfig';

export default function readWeatherApiConfig(): Promise<Asset<WeatherApiConfig>> {
  return readPrivateAsset('weather-api.json', validateWeatherApiConfig)
    .then(asset => {
      if (asset.error) {
        console.error(asset.error);
      }
      return asset;
    });
}