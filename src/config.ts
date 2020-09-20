export const PORT = envOrDefault('PORT', '1337');
export const IS_PRODUCTION = process.env.NODE_ENV === 'production';

function envOrDefault(key: string, defaultValue: string): string {
  return typeof process.env[key] !== 'undefined' ? process.env[key]! : defaultValue;
}
