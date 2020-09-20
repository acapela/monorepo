export const PORT = envOrDefault('PORT', '1337');
export const DB_CONNECTION_URL = envOrDefault(
  'DB_CONNECTION_URL',
  'postgres://postgres:dev@localhost:5432/postgres',
);
export const IS_PRODUCTION = process.env.NODE_ENV === 'production';

function envOrDefault(key: string, defaultValue: string): string {
  return typeof process.env[key] !== 'undefined' ? process.env[key]! : defaultValue;
}
