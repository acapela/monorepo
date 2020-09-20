export const PORT = envOrDefault('PORT', '1337');
export const FIREBASE_DATABASE_URL = envOrDefault(
  'FIREBASE_DATABASE_URL',
  'https://meetnomoreapp.firebaseio.com',
);
export const DB_CONNECTION_URL = envOrDefault(
  'DB_CONNECTION_URL',
  'postgres://postgres:dev@localhost:5432/postgres',
);
export const IS_PRODUCTION = process.env.NODE_ENV === 'production';
requiredFromEnv('GOOGLE_APPLICATION_CREDENTIALS'); // used automatically

function envOrDefault(key: string, defaultValue: string): string {
  return typeof process.env[key] !== 'undefined' ? process.env[key]! : defaultValue;
}

function requiredFromEnv(key: string): string {
  const value = process.env[key];
  if (typeof value === 'undefined') {
    throw new Error(`Missing required environment variable: ${key}`);
  }
  return value;
}
