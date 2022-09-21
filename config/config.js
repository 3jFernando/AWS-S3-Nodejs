import { config } from 'dotenv'

config();

export const AWS_BUCKET_NAME = process.env.AWS_BUCKET_NAME
export const AWS_BUCKET_REGION = process.env.AWS_BUCKET_REGION
export const AWS_USER_ID_PASSWORD_ACCESS = process.env.AWS_USER_ID_PASSWORD_ACCESS
export const AWS_USER_PASSWORD_ACCESS_SECRET = process.env.AWS_USER_PASSWORD_ACCESS_SECRET