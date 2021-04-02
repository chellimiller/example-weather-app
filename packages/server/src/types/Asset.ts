import { Result } from './Result';
import { ObjectValidationError, ReadAssetError } from './ServerError';

/**
 * Function that validates that an asset's structure/type is correct.
 */
export type AssetValidator<T = string> = (data: any) => Result<T, ObjectValidationError>;

/**
 * Result from attempting to read an asset.
 */
export type Asset<T = string> = Result<T, ReadAssetError>;