import { validate } from "class-validator";
import { NextFunction, Request, Response } from "express";
import { User } from "../entity/User";
import { createValidationError } from '../utils/errors';

export const register = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const user = new User();
        Object.entries(req.body).forEach(([key, value]) => {
            user[key] = value;
        });
        console.log('user object', user);

        const errors = await validate(user);
        if (errors.length) return next(createValidationError(errors));
    
        await user.save();
        res.status(201).json({ user });
    } catch (err) {
        next(err);
    }
}