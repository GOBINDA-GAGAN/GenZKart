import { Request, Response, NextFunction } from 'express';
import { CheckOtpRestrictions, validateRegisterData } from '../utils/auth.helper';
import prisma from '../../../../packages/libs/prisma';
import { ValidationError } from '../../../../packages/error-handler';

// Register a new user
export const registerUser = async (req: Request, res: Response, next: NextFunction) => {
  try {
    validateRegisterData(req.body, "user")
    const { name, email } = req.body
    const existingUser = await prisma.users.findUnique({ where: email });

    if (existingUser) {
      return next(new ValidationError("user already exiting with this email!"))
    }

 await CheckOtpRestrictions(email,next)


  } catch (error) {
    console.log(error);


  }

}