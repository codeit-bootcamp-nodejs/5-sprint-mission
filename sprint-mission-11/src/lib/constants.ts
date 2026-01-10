import dotenv from 'dotenv';

const envFile =
  process.env.NODE_ENV === 'production'
    ? '.env.prod'
    : process.env.NODE_ENV === 'test'
      ? '.env.test'
      : '.env';

dotenv.config({ path: envFile });

export const ACCESS_TOKEN_COOKIE_NAME = 'access-token';
export const REFRESH_TOKEN_COOKIE_NAME = 'refresh-token';
export const DATABASE_URL = process.env.DATABASE_URL || '';
export const JWT_ACCESS_TOKEN_SECRET = process.env.JWT_ACCESS_TOKEN_SECRET || '';
export const JWT_REFRESH_TOKEN_SECRET = process.env.JWT_REFRESH_TOKEN_SECRET || '';
export const NODE_ENV = process.env.NODE_ENV || 'development';
export const IS_PROD = NODE_ENV === 'production';
export const PORT = process.env.PORT || 3000;
export const PUBLIC_PATH = './public';
export const STATIC_PATH = '/public';
export const AWS_REGION = process.env.AWS_REGION || '';
export const AWS_S3_BUCKET = process.env.AWS_S3_BUCKET || '';
