import { Prisma } from "@prisma/client";
import bcrypt from "bcrypt";
import { Request, Response } from "express";
import jwt from "jsonwebtoken";
import { AuthLoginSchema } from "~schemas/AuthSchema";
import prisma from "~utils/database";

export const AuthLogin = async (req: Request, res: Response) => {
  try {
    const { success, error, data } = AuthLoginSchema.safeParse(req.body);
    if (!success) {
      return res.status(400).send(error.message); // Malformed Data
    }

    const user = await prisma.user.findUniqueOrThrow({
      where: { username: data.username },
    }); // We are able to pass the raw password to prisma because it is handled in /src/utils/database

    const isMatch = await bcrypt.compare(data.password, user.password);
    if (!isMatch) return res.status(401).send(); // Invalid Credentials

    const { jwtid } = await prisma.validToken.create({
      // Store active keys in database so they can be
      data: {
        User: {
          connect: user,
        },
      },
    });

    const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET!, {
      expiresIn: "3h",
      jwtid,
    });

    return res.status(200).json({ token }); // Signed in successfully
  } catch (e) {
    if (e instanceof Prisma.PrismaClientKnownRequestError) {
      // Prisma error codes: https://www.prisma.io/docs/reference/api-reference/error-reference#error-codes
      // P2025: Not Found Error
      if (e.code === "P2025") {
        return res.status(400).send(); // User not found (Malformed Data)
      }
    }
    return res.status(500).send(); // Server Error
  }
};
