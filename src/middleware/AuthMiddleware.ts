import env from "~utils/env";
import prisma from "~utils/database";
import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

export default async (req: Request, res: Response, next: NextFunction) => {
  const token = req.header("Authorization")?.split(" ")[1];
  if (!token) return res.status(401).send();

  try {
    const decoded = jwt.verify(token, env.JWT_SECRET);
    if (typeof decoded == "string") {
      throw new Error();
    }
    const { id, jti } = decoded;

    const user = await prisma.user.findFirstOrThrow({
      where: {
        id,
      },
      include: {
        validTokens: true,
        tasks: true,
      },
    });

    if (!jti || !user.validTokens.map((tok) => tok.jwtid).includes(jti)) {
      console.log("Invalid/Revoked Token Used.");
      throw new Error();
    }

    res.locals = {
      tasks: user.tasks,
      user,
      jti,
    };

    next();
  } catch (err) {
    res.status(401).send();
    return;
  }
};
