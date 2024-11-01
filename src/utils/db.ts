import { Pool } from 'pg';

if (!process.env.POSTGRES_URI) {
    console.error('Error: POSTGRES_URI is not set.');
    process.exit(1);
}
const postgresURI = process.env.POSTGRES_URI;

const pool = new Pool({
    connectionString: postgresURI
});

pool.on('error', (err: any) => {
    console.error('Unexpected error on idle client', err);
    process.exit(-1);
});

export default pool;