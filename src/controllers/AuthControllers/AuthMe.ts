import { Request, Response } from "express";
import { LocalUser } from "~utils/database";

export const AuthMe = async (req: Request, res: Response) => {
  try {
    const user = res.locals.user as LocalUser;

    return res.status(200).json({
      user: { ...user },
      validTokens: user.validTokens.map((v) => v.jwtid),
    }); // User Data
  } catch (e) {
    return res.status(500).send(); // Server Error
  }
};
