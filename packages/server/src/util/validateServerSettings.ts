import { AssetValidator, ReadAssetErrorType } from './readAsset';

export type ServerSettingsOrigin = {
  port: number;
  hostname: string;
}

export type ServerSettings = {
  origin: ServerSettingsOrigin;
}

const validateServerSettings: AssetValidator<ServerSettings> = (settings: any) => {
  if (typeof settings !== 'object') {
    const message = `Invalid Server Settings: Type of 'settings' should be 'object' but is '${typeof settings}'`;
    return {
      data: undefined,
      error: {
        type: ReadAssetErrorType.VALIDATION,
        message,
        details: message,
      },
    };
  }

  if (typeof settings.origin !== 'object') {
    const message = `Invalid Server Settings: Type of 'settings.origin' should be 'object' but is '${typeof settings.origin}'`;
    return {
      data: undefined,
      error: {
        type: ReadAssetErrorType.VALIDATION,
        message,
        details: message,
      },
    };
  }

  if (typeof settings.origin.port !== 'number') {
    const message = `Invalid Server Settings: Type of 'settings.origin.port' should be 'number' but is '${typeof settings.origin.port}'`;
    return {
      data: undefined,
      error: {
        type: ReadAssetErrorType.VALIDATION,
        message,
        details: message,
      },
    };
  }

  if (typeof settings.origin.hostname !== 'string') {
    const message = `Invalid Server Settings: Type of 'settings.origin.hostname' should be 'string' but is '${typeof settings.origin.hostname}'`;
    return {
      data: undefined,
      error: {
        type: ReadAssetErrorType.VALIDATION,
        message,
        details: message,
      },
    };
  }

  return {
    data: settings,
    error: undefined,
  };
}

export default validateServerSettings;
