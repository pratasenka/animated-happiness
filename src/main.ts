import "reflect-metadata"
import 'dotenv/config'

import express, { Request, Response, NextFunction } from 'express';
import session from 'express-session';
import cookieParser from 'cookie-parser';

import { routes } from './routes';

function main() {
    const app = express();

    if (!process.env.PORT) {
        console.error('Error: PORT is not set.');
        process.exit(1);
    }
    const port: number = parseInt(process.env.PORT);

    if (!process.env.COOKIE_SECRET) {
        console.error('Error: COOKIE_SECRET is not set.');
        process.exit(1);
    }
    const cookieSecret = process.env.COOKIE_SECRET;

    app.use(express.json());
    app.use(cookieParser(cookieSecret));
    app.use(
        session({
            secret: cookieSecret,
            resave: false,
            saveUninitialized: false,
            cookie: {
                sameSite: 'strict',
                maxAge: 60000 * 5,
            },
            store: new session.MemoryStore()
        })
    );
    app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
        res.status(500).json({ message: err.message });
    });
    app.use('/api', routes);

    app.listen(port, () => {
        console.log(`Server is running on http://localhost:${port}`);
    });
}

main()