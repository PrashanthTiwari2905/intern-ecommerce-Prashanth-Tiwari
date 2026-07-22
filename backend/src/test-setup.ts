import * as dotenv from 'dotenv';
import * as path from 'path';

// Load the .env.test file into process.env before any tests run
dotenv.config({ path: path.resolve(__dirname, '../.env.test') });
