import { Request, Response } from "express";
import prisma, { LocalUser } from "~utils/database";

export const AuthLogout = async (req: Request, res: Response) => {
  try {
    const id = res.locals.jti as string;
    const user = res.locals.user as LocalUser;

    const d = await prisma.validToken.delete({
      where: {
        jwtid: id,
        userId: user.id,
      },
    });

    return res.status(202).send(); // Token revoked
  } catch (e) {
    return res.status(500).send(); // server Error
  }
};
