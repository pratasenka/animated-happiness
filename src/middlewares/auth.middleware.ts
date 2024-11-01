import { Request, Response, NextFunction } from "express";

export const authMiddleware = (req: Request, res: Response, next: NextFunction) => {
    if (req.session.userId) next();
    else res.status(401).send({ message: 'You are not authenticated' });
};