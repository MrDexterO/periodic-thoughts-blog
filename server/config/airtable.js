import dotenv from 'dotenv';

import Airtable from 'airtable';

dotenv.config();

const base = new Airtable({
    apiKey: process.env.AIRTABLE_TOKEN
}).base(process.env.AIRTABLE_BASE_ID);

export default base;

